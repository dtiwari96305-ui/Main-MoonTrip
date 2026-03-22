/**
 * Namespaced sessionStorage helper.
 * All keys are auto-prefixed with the current mode (demo_ or real_)
 * to prevent state collisions when switching between modes.
 */

let _currentMode = 'demo';

export const setMode = (mode) => {
  _currentMode = mode;
};

export const getMode = () => _currentMode;

const prefixKey = (key) => `${_currentMode}_${key}`;

export const getItem = (key) => {
  return sessionStorage.getItem(prefixKey(key));
};

export const setItem = (key, value) => {
  sessionStorage.setItem(prefixKey(key), value);
};

export const removeItem = (key) => {
  sessionStorage.removeItem(prefixKey(key));
};

/**
 * Clear all sessionStorage keys for a specific mode.
 * Used when switching modes via the landing screen.
 */
export const clearModeKeys = (mode) => {
  const prefix = `${mode}_`;
  const keysToRemove = [];
  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    if (key && key.startsWith(prefix)) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach((key) => sessionStorage.removeItem(key));
};
