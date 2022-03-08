import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { StoreLocation as StoreModel } from '../models/store-location/store-location.model';
import { StoresMapService } from '../services/stores-map/stores-map.service';
import { getError, getHighlightedStore, getLoading, getStores, highlightStore, loadStores } from '../store/stores';

@Injectable({ providedIn: 'root' })
export class StoreLocatorFacade {
  constructor(private mapService: StoresMapService, private store: Store) {}

  loadStores(countryCode: string, postalCode: string, city: string) {
    this.store.dispatch(loadStores({ countryCode, postalCode, city }));
  }

  getLoading$() {
    return this.store.pipe(select(getLoading));
  }

  getError$() {
    return this.store.pipe(select(getError));
  }

  getStores$() {
    return this.store.pipe(select(getStores));
  }

  getHighlighted$() {
    return this.store.pipe(select(getHighlightedStore));
  }

  setHighlighted(store: StoreModel) {
    this.store.dispatch(highlightStore({ storeId: store.id }));
  }

  loadMap(container: HTMLElement) {
    this.mapService.initialize(container);
  }
}
