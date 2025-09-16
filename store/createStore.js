import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

// See Example: https://github.com/vikejs/vike-react/tree/main/examples/zustand

const createStore = (initializer, options = {}) => {
  const { name = `store-${Date.now()}`, persistKey = null, devtoolsEnabled = import.meta.env?.DEV ?? false } = options;

  let store = initializer;

  if (persistKey) {
    store = persist(store, { name: persistKey });
  }

  if (devtoolsEnabled) {
    store = devtools(store, { name, enabled: true });
  }

  store = immer(store);

  return create(store);
};

export default createStore;
