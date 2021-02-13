export type Event = {
  name: string;
  invoke: (...args: any[]) => unknown;
};
