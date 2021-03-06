import { CATCH_MESSAGE_STYLE, DEPTH } from "./globals";
import MSG from "./messages";
import store from "./store";

export function applyModifiersToState(state) {
  const modState = { ...state };
  state.modifiers.forEach((modifier) => {
    for (const prop in modifier) {
      if (prop !== "modifiers" && prop !== "op" && prop in modState)
        switch (modifier.op) {
          case "multiply":
            modState[prop] *= modifier[prop];
            break;
          case "add":
          default:
            modState[prop] += modifier[prop];
        }
    }
  });
  return modState;
}

export function addModifierWithoutDuplicates(state, modifier) {
  const isDuplicate = state.modifiers.some(
    (existingModifier) => existingModifier.key == modifier.key
  );
  if (isDuplicate) return state;
  return {
    ...state,
    modifiers: state.modifiers.concat([modifier]),
  };
}

export function removeModifier(state, key) {
  return {
    ...state,
    modifiers: state.modifiers.filter((modifier) => modifier.key !== key),
  };
}

export function chooseFromArray(arr, num) {
  const buffer = arr.slice();
  if (num >= arr.length) return buffer;
  const ret = [];
  for (let i = 0; i < num; i++) {
    const idx = Math.floor(Math.random() * buffer.length);
    ret.push(...buffer.splice(idx, 1));
  }
  return ret;
}

export function addTextEffect(
  scene,
  {
    text,
    x,
    y,
    style = CATCH_MESSAGE_STYLE,
    depth = DEPTH.UIFRONT,
    hold: delay = 250,
    duration = 500,
    deltaY = -50,
  }
) {
  const effectText = scene.add
    .text(x, y, text, style)
    .setDepth(depth)
    .setOrigin(0.5, 0.5);
  scene.tweens.add({
    targets: effectText,
    alpha: 0,
    y: y + deltaY,
    delay: delay,
    duration: duration,
    onComplete: () => effectText.destroy(),
  });
}

export function syncSpritePhysics(from, to, xOffset = 0, yOffset = 0) {
  to.x = from.x + xOffset;
  to.y = from.y + yOffset;
  const velocity = from.body?.velocity;
  const acceleration = from.body?.acceleration;
  to.body?.setVelocity(velocity?.x, velocity?.y);
  to.body?.setAcceleration(acceleration?.x, acceleration?.y);
}

export function timestampToDateString(value) {
  const date = new Date(value);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return `${year}.${month}.${day}`;
}

export function descendingSortedIndex(array, value, key = (v) => v) {
  var low = 0,
    high = array.length;

  while (low < high) {
    var mid = (low + high) >>> 1;
    if (key(array[mid]) > value) low = mid + 1;
    else high = mid;
  }
  return low;
}

export function getMessage(key) {
  const lang = store.getState().settings.language;
  return MSG[key][lang];
}

export function traverseState(state, path) {
  return path.split(".").reduce((st, key) => st[key], state);
}

export function formatSummation(n) {
  if (n < 2) return `${n}`;
  if (n === 2) return "(1+2)";
  return `(?? ${n})`;
}

export function shortenString(s, length = 10) {
  if (s.length > Math.max(3, length)) return s.substring(0, length - 2) + "...";
  return s;
}
