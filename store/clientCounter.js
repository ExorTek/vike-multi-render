import createStore from './createStore';

const useClientCounterStore = createStore(
  set => ({
    count: 0,

    increment: () => set(state => ({ count: state.count + 1 })),
    decrement: () => set(state => ({ count: state.count - 1 })),
    reset: () => set({ count: 0 }),
  }),
  { name: 'client-counter', persistKey: 'client-counter' },
);

export default useClientCounterStore;
