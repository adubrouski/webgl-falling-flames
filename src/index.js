import { ErrorHandler } from "./Helpers/ErrorHandler.js";
import { renderApp } from "./App.js";

ErrorHandler.handle();

const settings = {
  flameCount: 100,
  flameParticleCount: 70,
  widthRange: [20, 35],
  heightRange: [40, 70],
  noiseRange: [10, 15],
  speedRange: [20, 80],
  particleTopColor: [1, 0.5, 0],
  particleBottomColor: [1, 0, 0],
}

const fpsCountViewElement = document.querySelector("#fps-count-view");
const flamesCountViewElement = document.querySelector("#flames-count-view");
const particlesCountViewElement = document.querySelector("#particles-count-view");

const flamesCountInputElement = document.querySelector("#flames-count-input");

flamesCountViewElement.innerText = `${settings.flameCount} flames`;
particlesCountViewElement.innerText = `${settings.flameCount * settings.flameParticleCount} particles`;
flamesCountInputElement.value = settings.flameCount;

/**
 * @type {{destroy:Function}}
 */
let currentApp = renderApp({
  settings,
  fpsCountViewElement,
});
/**
 * @type {null|number}
 */
let renderTimerId = null;

flamesCountInputElement.addEventListener("input", (e) => {
  const flameCount = Number(e.target.value);

  flamesCountViewElement.innerText = `${flameCount} flames`;
  particlesCountViewElement.innerText = `${flameCount * settings.flameParticleCount} particles`;

  if (renderTimerId !== null) {
    clearTimeout(renderTimerId);
  }

  renderTimerId = setTimeout(
    () => {
      settings.flameCount = flameCount;

      currentApp.destroy();

      currentApp = renderApp({
        settings,
        fpsCountViewElement,
      });
    },
    0,
  )
});
