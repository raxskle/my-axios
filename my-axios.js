// const { InterceptorManager } = require("./interceptor.js");
// const { xhrAdapter } = require("./adapter.js");

// Axios类
class Axios {
  constructor(config) {
    // 默认属性
    this.defaults = config;
    // 拦截器
    this.interceptors = {
      request: new InterceptorManager(),
      response: new InterceptorManager(),
    };
  }
  request(config) {
    // 调用时，config有传入的属性就使用，没有传入的属性就按照defaults默认
    Object.keys(config).forEach((key) => {
      this.defaults[key] = config[key];
    });
    console.log("开始调用myaxios", config.method, this.defaults);
    //
    // 实现请求流程：
    // 创建一个成功的promise对象，能让config通过promsie链式传递下去
    let promise = Promise.resolve(config);
    // 流程链
    let chains = [dispatchRequest, undefined];
    // 加入请求拦截器
    this.interceptors.request.handlers.forEach((item) => {
      chains.unshift(item.fulfilledFunc, item.rejectedFunc);
    });
    // 加入响应拦截器
    this.interceptors.response.handlers.forEach((item) => {
      chains.push(item.fulfilledFunc, item.rejectedFunc);
    });
    // 执行：
    // 弹出整个队列，链式调用then，遍历请求拦截器、发送请求、相应拦截器
    while (chains.length > 0) {
      promise = promise.then(chains.shift(), chains.shift());
    }
    return promise;
  }
  get(config) {
    config.method = "GET";
    return this.request(config);
  }
  post(config) {
    config.method = "POST";
    return this.request(config);
  }
}

// Axios.request()调用dispatchRequest()，
// 再调用底层adapter决定是用浏览器的xhr还是node环境的http来请求
// dispatchRequest（进行请求的函数），接收config，返回promsie对象
function dispatchRequest(config) {
  // 得到并返回由adapter的响应结果封装成的promsie
  // 这里中途可以做一些对响应结果的处理再返回出去
  return xhrAdapter(config).then(
    (response) => {
      // console.log(response); do sth
      return response;
    },
    (error) => {
      console.log(error);
    }
  );
}

// 默认的属性，会在创建axios时默认传入
const defaultConfig = {
  method: "DEFAULT",
  url: "url",
};

// 创建axios的函数
function createInstance(config) {
  // 实例化Axios对象context
  let context = new Axios(config);
  // 创建请求函数instance，并且绑定this是context实例
  let instance = Axios.prototype.request.bind(context);

  // 将对象原型方法添加到instance中 ！class的方法是不可枚举的，用Object.keys()拿不到的
  Reflect.ownKeys(Axios.prototype).forEach((key) => {
    instance[key] = Axios.prototype[key].bind(context);
  });

  // 将对象自身属性（defaults和interceptor）添加到instance中
  Object.keys(context).forEach((key) => {
    instance[key] = context[key];
  });

  return instance;
}

// 得到axios
// axios是Axios的请求函数，同时绑定了Axios的实例对象的所有属性和方法，
// 所以axios可以直接当作函数进行请求，也可以作为对象调用它的属性方法
let myaxios = createInstance(defaultConfig);

// module.exports = { myaxios };
