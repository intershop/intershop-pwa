/* SystemJS module definition */
declare var module: NodeModule;
interface NodeModule {
  id: string;
}

// declare namespace jasmine {
//   interface Matchers<T> {
//     toMatchSnapshot(snapshotName?: string): T;
//   }
// }

declare namespace jest {
  interface Matchers<R> {
    toBeObservable(marbles: any, objects?: any, errors?: any);
  }
}
