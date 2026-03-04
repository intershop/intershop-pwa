import { Injectable, inject } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { ModuleLoaderService } from 'ish-core/utils/module-loader/module-loader.service';
import { StoreLocation as StoreModel } from '../models/store-location/store-location.model';
import { StoresMapService } from '../services/stores-map/stores-map.service';
import { getError, getHighlightedStore, getLoading, getStores, highlightStore, loadStores } from '../store/stores';

@Injectable({ providedIn: 'root' })
export class StoreLocatorFacade {
  private moduleLoader = inject(ModuleLoaderService);

  constructor(private mapService: StoresMapService, private store: Store) {}

  loadStores(countryCode: string, postalCode: string, city: string) {
    void this.moduleLoader
      .ensureLoaded('storeLocator')
      .then(() => this.store.dispatch(loadStores({ countryCode, postalCode, city })));
  }

  getLoading$() {
    return this.moduleLoader.whenLoaded('storeLocator', () => this.store.pipe(select(getLoading)));
  }

  getError$() {
    return this.moduleLoader.whenLoaded('storeLocator', () => this.store.pipe(select(getError)));
  }

  getStores$() {
    return this.moduleLoader.whenLoaded('storeLocator', () => this.store.pipe(select(getStores)));
  }

  getHighlighted$() {
    return this.moduleLoader.whenLoaded('storeLocator', () => this.store.pipe(select(getHighlightedStore)));
  }

  setHighlighted(store: StoreModel) {
    void this.moduleLoader.ensureLoaded('storeLocator').then(() =>
      this.store.dispatch(highlightStore({ storeId: store.id }))
    );
  }

  loadMap(container: HTMLElement) {
    this.mapService.initialize(container);
  }
}
