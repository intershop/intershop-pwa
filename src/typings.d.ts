/* SystemJS module definition */
declare var module: NodeModule;
interface NodeModule {
  id: string;
}

declare namespace jasmine {
  interface Matchers<T> {
    toMatchSnapshot(snapshotName?: string): T;
  }
}
