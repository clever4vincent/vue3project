class ThreadPool {
  constructor(maxSize) {
    this.maxSize = maxSize;
    this.workers = [];
    this.tasks = [];
  }

  run(task, transferList) {
    return new Promise((resolve, reject) => {
      const worker = this.getWorker();
      // console.log(worker);
      worker.onmessage = (event) => {
        console.log(5555);
        resolve(event.data);
        this.releaseWorker(worker);
      };
      worker.onerror = reject;
      worker.postMessage(task, transferList);
    });
  }

  getWorker() {
    if (this.workers.length < this.maxSize) {
      // const worker = new Worker("worker.js");
      const worker = new Worker(new URL("@/workers/worker.js", import.meta.url));
      this.workers.push(worker);
      return worker;
    } else {
      return this.tasks.shift();
    }
  }

  releaseWorker(worker) {
    const index = this.workers.indexOf(worker);
    if (index !== -1) {
      this.workers.splice(index, 1);
      worker.terminate(); // 结束 worker
      worker = null;
    }
    if (this.tasks.length > 0) {
      this.run(this.tasks.shift());
    }
  }
}
export const threadPool = new ThreadPool(10);
