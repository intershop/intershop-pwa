import { TestBed } from '@angular/core/testing';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';

import { FeatureToggleService } from 'ish-core/feature-toggle';
import { ModuleLoaderService } from 'ish-core/utils/module-loader/module-loader.service';

import { StoresService } from './services/stores/stores.service';
import { provideStoreLocatorFeature } from './store-locator-feature.providers';

describe('Store Locator Feature Providers', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ...provideStoreLocatorFeature(),
        {
          provide: FeatureToggleService,
          useValue: {
            enabled: (feature: string) => feature === 'storeLocator',
          },
        },
        {
          provide: StoresService,
          useValue: {
            getStores: jest.fn(),
          },
        },
        provideEffects(),
        provideStore(),
      ],
    });
  });

  it('should lazy load the store locator feature providers', async () => {
    const moduleLoader = TestBed.inject(ModuleLoaderService);

    await expect(moduleLoader.ensureLoaded('storeLocator')).resolves.toBeUndefined();
  });
});
