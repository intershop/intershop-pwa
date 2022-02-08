import { Store } from './store.model';

export class StoreHelper {
  static equal(store1: Store, store2: Store): boolean {
    return !!store1 && !!store2 && store1.id === store2.id;
  }
}
