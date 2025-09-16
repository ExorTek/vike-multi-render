import createStore from './createStore';

const useServerCounterStore = createStore(
  set => ({
    count: 0,

    increment: () => set(state => ({ count: state.count + 1 })),
    decrement: () => set(state => ({ count: state.count - 1 })),
    reset: () => set({ count: 0 }),
  }),
  { name: 'server-counter', persistKey: 'server-counter' },
);

export default useServerCounterStore;
