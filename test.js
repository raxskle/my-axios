// const { myaxios } = require("./my-axios");
const url = "http://httpbin.org/get";

//
// test：
// 直接调用myaxios()相当于直接调用Axios.request()
// myaxios({});

console.dir(myaxios);

myaxios.interceptors.request.use(
  (config) => {
    console.log("请求拦截器1 拦截请求：", config);
    return config;
  },
  (error) => {
    console.log("请求拦截器1 请求失败", error);
  }
);

myaxios.interceptors.request.use(
  (config) => {
    console.log("请求拦截器2 拦截请求：", config);
    return config;
  },
  (error) => {
    console.log("请求拦截器2 请求失败", error);
  }
);

myaxios.interceptors.response.use(
  (config) => {
    console.log("响应拦截器 拦截响应：", config);
    return config;
  },
  (error) => {
    console.log("响应拦截器 请求失败", error);
  }
);

myaxios({ method: "GET", url: url }).then((data) => {
  console.log("调用myaxios.then()", data);
});

// myaxios.get({});
// myaxios.post({});
