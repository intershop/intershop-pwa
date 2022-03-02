import { StoreLocation } from './store-location.model';

export class StoreLocationHelper {
  static equal(store1: StoreLocation, store2: StoreLocation): boolean {
    return !!store1 && !!store2 && store1.id === store2.id;
  }
}
