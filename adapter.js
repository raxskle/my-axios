// adapter 发送XMLHttpRequest请求
function xhrAdapter(config) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(config.method, config.url);
    xhr.send();
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status >= 200 && xhr.status < 300) {
          let result = {
            config: config,
            data: xhr.response,
            headers: xhr.getAllResponseHeaders(),
            request: xhr,
            status: xhr.status,
          };
          resolve(result);
        } else {
          reject();
        }
      }
    };
  });
}

// module.exports = { xhrAdapter };
