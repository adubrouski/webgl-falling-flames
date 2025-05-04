import { WORKER_OUTGOING_MESSAGE } from "../Workers/WorkerOutgoingMessage.js";

class WorkerPool {
  constructor({ size, createWorker, initWorker }) {
    this.workers = new Array(size).fill(null).map((_, i) => createWorker(i));
    this.pendingUpdates = 0;
    this.workerUpdateStatus = new Array(size).fill(false);
    this.onAllUpdated = null;

    this.workers.forEach((worker, index) => {
      worker.onmessage = (event) => {
        if (event.data?.type === WORKER_OUTGOING_MESSAGE.FLAMES_UPDATE_COMPLETED) {
          this.workerUpdateStatus[index] = true;
          this.pendingUpdates--;

          if (this.pendingUpdates === 0 && this.onAllUpdated) {
            this.onAllUpdated();
          }
        }
      };

      if (initWorker) {
        initWorker(worker, index);
      }
    });
  }

  broadcastUpdate(message, onComplete) {
    this.pendingUpdates = this.workers.length;
    this.workerUpdateStatus.fill(false);
    this.onAllUpdated = onComplete;

    for (const worker of this.workers) {
      worker.postMessage(message);
    }
  }

  destroy() {
    for (const worker of this.workers) {
      worker.terminate();
    }
  }
}

export { WorkerPool }
