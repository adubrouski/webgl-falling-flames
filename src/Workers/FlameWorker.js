import { Flame } from "../Entities/Flame.js";
import { WORKER_INCOMING_MESSAGE } from "./WorkerIncomingMessage.js";
import { WORKER_OUTGOING_MESSAGE } from "./WorkerOutgoingMessage.js";

const state = {
  flames: [],
};

const initializeFlamesHandler = (data) => {
  if (state.flames.length > 0) {
    throw new Error("Cannot initialize FlameWorker twice");
  }

  const { particleCount, totalParticleCount } = data;

  const offsetsArray = new Float32Array(data.offsetsBuffer);
  const phasesArray = new Float32Array(data.phasesBuffer);
  const sizesArray = new Float32Array(data.sizesBuffer);
  const timesArray = new Float32Array(data.timesBuffer);
  const baseYArray = new Float32Array(data.baseYBuffer);

  const centerXArray = new Float32Array(totalParticleCount);
  const heightArray = new Float32Array(totalParticleCount);
  const noiseAmpArray = new Float32Array(totalParticleCount);

  for (let i = 0; i < data.flameOffsets.length; i++) {
    state.flames.push(
      Flame.create({
        canvas: {
          width: data.canvasWidth,
          height: data.canvasHeight,
        },
        centerXArray,
        heightArray,
        noiseAmpArray,
        particlesCount: particleCount,
        widthRange: data.widthRange,
        heightRange: data.heightRange,
        noiseRange: data.noiseRange,
        speedRange: data.speedRange,
        sharedArrays: {
          offsets: offsetsArray,
          phases: phasesArray,
          sizes: sizesArray,
          times: timesArray,
          baseYArray,
        },
        offset: data.flameOffsets[i],
        dpr: data.dpr,
      }),
    );
  }
}

const updateFlamesHandler = (data) => {
  for (let i = 0; i < state.flames.length; i++) {
    state.flames[i].update(data.deltaTime);
  }

  self.postMessage({ type: WORKER_OUTGOING_MESSAGE.FLAMES_UPDATE_COMPLETED });
}

self.onmessage = (event) => {
  const { type, data } = event.data;

  switch (type) {
    case WORKER_INCOMING_MESSAGE.INITIALIZE_FLAMES: return initializeFlamesHandler(data);
    case WORKER_INCOMING_MESSAGE.UPDATE_FLAMES: return updateFlamesHandler(data);
  }
};
