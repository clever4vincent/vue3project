// worker.js

self.onmessage = (event) => {
  const task = event.data;
  new Promise((resolve, reject) => {
    // 执行异步任务
    // ...
    for (let i = 0; i < 100; i++) {
      console.log(i);
    }
    resolve(444);
  })
    .then((result) => {
      // 将结果发送回主线程
      console.log(result);
      self.postMessage(result);
    })
    .catch((error) => {
      // 处理错误
      console.error(error);
    });
};
