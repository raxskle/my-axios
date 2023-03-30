// 拦截器
// 将拦截函数加入执行流程队列
// axios.interceptors.request和axios.interceptors.response的值就是实例对象
// use时先存入handlers
// 等待执行Axios.request函数，创建了执行流程链chains时再根据请求和响应拦截器放入链中
class InterceptorManager {
  constructor(config) {
    this.handlers = [];
  }
  use(fulfilledFunc, rejectedFunc) {
    // use时先压入handlers
    this.handlers.push({ fulfilledFunc, rejectedFunc });
  }
}

// module.exports = { InterceptorManager };
