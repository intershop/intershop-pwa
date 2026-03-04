import { Injectable, inject } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { ModuleLoaderService } from 'ish-core/utils/module-loader/module-loader.service';
import { clearRecently, getMostRecentlyViewedProducts, getRecentlyViewedProducts } from '../store/recently';

@Injectable({ providedIn: 'root' })
export class RecentlyFacade {
  private moduleLoader = inject(ModuleLoaderService);

  constructor(private store: Store) {}

  recentlyViewedProducts$ = this.moduleLoader.whenLoaded('recently', () =>
    this.store.pipe(select(getRecentlyViewedProducts))
  );
  mostRecentlyViewedProducts$ = this.moduleLoader.whenLoaded('recently', () =>
    this.store.pipe(select(getMostRecentlyViewedProducts))
  );

  clearRecentlyViewedProducts() {
    void this.moduleLoader.ensureLoaded('recently').then(() => this.store.dispatch(clearRecently()));
  }
}
