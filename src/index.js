import { ErrorHandler } from "./Helpers/ErrorHandler.js";
import { GlManager } from "./Helpers/GlManager.js";
import { ResizeHandler } from "./Helpers/ResizeHandler.js";
import { Dom } from "./Entities/Dom.js";
import { FpsCounter } from "./Helpers/FpsCounter.js";
import { FrameLoop } from "./Helpers/FrameLoop.js";
import { DeltaTimer } from "./Helpers/DeltaTimer.js";
import { DprManager } from "./Helpers/DprManager.js";
import { Utils } from "./Helpers/Utils.js";

ErrorHandler.handle();

const { canvas, ctx } = GlManager.getRenderer("canvas");

const settings = window.__SETTINGS__;
delete window.__SETTINGS__;

const doRenderApp = (currentApp) => {
  const fpsCounter = new FpsCounter();

  fpsCounter.onUpdate = Dom.updateCanvasFps.bind(Dom);

  const frameLoop = new FrameLoop(60);

  Dom.updateCanvasStats(settings.flameCount, settings.flameParticleCount);

  const renderAppModule = import(/* @vite-ignore */`./${window.__ENTRYPOINT__}`)
    .then((module) => module.renderApp);

  const options = {
    settings,
    ctx,
    frameLoop,
    canvas,
    fpsCounter,
    totalParticleCount: settings.flameCount * settings.flameParticleCount,
    workerCount: window.__WORKER_COUNT__,
    deltaTimer: new DeltaTimer(performance.now()),
    dpr: DprManager.calculateDpr(),
  };

  if (currentApp !== undefined) {
    return currentApp
      .then((it) => it.destroy())
      .then(() => renderAppModule)
      .then((render) => render(options));
  }

  return renderAppModule.then((render) => render(options));
};

let currentApp = doRenderApp();

Dom.flamesCountInputElement.addEventListener(
  "input",
  Utils.debounce(
    (e) => {
      settings.flameCount = Number(e.target.value);

      Dom.updateCanvasStats(settings.flameCount, settings.flameParticleCount);

      currentApp = doRenderApp(currentApp);
    },
    100
  ),
);

ResizeHandler.handle(canvas, ctx, () => currentApp = doRenderApp(currentApp));
