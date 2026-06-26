import { TestBed, fakeAsync, flush } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { getFeatures } from 'ish-core/store/core/configuration';

import {
  LAZY_FEATURE_MODULE,
  LAZY_FEATURE_PROVIDER,
  LazyFeatureProviderType,
  ModuleLoaderService,
} from './module-loader.service';

describe('Module Loader Service', () => {
  let service: ModuleLoaderService;

  function provideFeature(overrides: Partial<LazyFeatureProviderType> & Pick<LazyFeatureProviderType, 'feature'>) {
    return {
      provide: LAZY_FEATURE_PROVIDER,
      useValue: {
        providers: () => Promise.resolve([]),
        ...overrides,
      },
      multi: true,
    };
  }

  describe('init()', () => {
    it('should load features without explicit loadStrategy at init when toggle is enabled', fakeAsync(() => {
      const providersFn = jest.fn(() => Promise.resolve([]));

      TestBed.configureTestingModule({
        providers: [
          provideFeature({ feature: 'rating', providers: providersFn }),
          provideMockStore({ selectors: [{ selector: getFeatures, value: ['rating'] }] }),
        ],
      });

      service = TestBed.inject(ModuleLoaderService);
      service.init();
      flush();

      expect(providersFn).toHaveBeenCalled();
    }));

    it('should load features with explicit loadStrategy appInit at init', fakeAsync(() => {
      const providersFn = jest.fn(() => Promise.resolve([]));

      TestBed.configureTestingModule({
        providers: [
          provideFeature({ feature: 'tracking', loadStrategy: 'appInit', providers: providersFn }),
          provideMockStore({ selectors: [{ selector: getFeatures, value: ['tracking'] }] }),
        ],
      });

      service = TestBed.inject(ModuleLoaderService);
      service.init();
      flush();

      expect(providersFn).toHaveBeenCalled();
    }));

    it('should NOT load features with loadStrategy onDemand at init', fakeAsync(() => {
      const providersFn = jest.fn(() => Promise.resolve([]));

      TestBed.configureTestingModule({
        providers: [
          provideFeature({ feature: 'contactUs', loadStrategy: 'onDemand', providers: providersFn }),
          provideMockStore({ selectors: [{ selector: getFeatures, value: ['contactUs'] }] }),
        ],
      });

      service = TestBed.inject(ModuleLoaderService);
      service.init();
      flush();

      expect(providersFn).not.toHaveBeenCalled();
    }));

    it('should NOT load features when their toggle is disabled', fakeAsync(() => {
      const providersFn = jest.fn(() => Promise.resolve([]));

      TestBed.configureTestingModule({
        providers: [
          provideFeature({ feature: 'rating', providers: providersFn }),
          provideMockStore({ selectors: [{ selector: getFeatures, value: [] }] }),
        ],
      });

      service = TestBed.inject(ModuleLoaderService);
      service.init();
      flush();

      expect(providersFn).not.toHaveBeenCalled();
    }));

    it('should always load features with feature "always"', fakeAsync(() => {
      const providersFn = jest.fn(() => Promise.resolve([]));

      TestBed.configureTestingModule({
        providers: [
          provideFeature({ feature: 'always', providers: providersFn }),
          provideMockStore({ selectors: [{ selector: getFeatures, value: [] }] }),
        ],
      });

      service = TestBed.inject(ModuleLoaderService);
      service.init();
      flush();

      expect(providersFn).toHaveBeenCalled();
    }));
  });

  describe('ensureLoaded()', () => {
    it('should load an onDemand feature when explicitly called', fakeAsync(() => {
      const providersFn = jest.fn(() => Promise.resolve([]));

      TestBed.configureTestingModule({
        providers: [
          provideFeature({ feature: 'contactUs', loadStrategy: 'onDemand', providers: providersFn }),
          provideMockStore({ selectors: [{ selector: getFeatures, value: ['contactUs'] }] }),
        ],
      });

      service = TestBed.inject(ModuleLoaderService);
      service.ensureLoaded('contactUs');
      flush();

      expect(providersFn).toHaveBeenCalled();
    }));

    it('should not load a feature twice', fakeAsync(() => {
      const providersFn = jest.fn(() => Promise.resolve([]));

      TestBed.configureTestingModule({
        providers: [
          provideFeature({ feature: 'rating', providers: providersFn }),
          provideMockStore({ selectors: [{ selector: getFeatures, value: ['rating'] }] }),
        ],
      });

      service = TestBed.inject(ModuleLoaderService);
      service.ensureLoaded('rating');
      flush();
      service.ensureLoaded('rating');
      flush();

      expect(providersFn).toHaveBeenCalledTimes(1);
    }));

    it('should not load a feature when its toggle is disabled', fakeAsync(() => {
      const providersFn = jest.fn(() => Promise.resolve([]));

      TestBed.configureTestingModule({
        providers: [
          provideFeature({ feature: 'rating', providers: providersFn }),
          provideMockStore({ selectors: [{ selector: getFeatures, value: [] }] }),
        ],
      });

      service = TestBed.inject(ModuleLoaderService);
      service.ensureLoaded('rating');
      flush();

      expect(providersFn).not.toHaveBeenCalled();
    }));
  });

  describe('backward compatibility', () => {
    it('should still load features registered with deprecated LAZY_FEATURE_MODULE token', fakeAsync(() => {
      const providersFn = jest.fn(() => Promise.resolve([]));

      TestBed.configureTestingModule({
        providers: [
          {
            // eslint-disable-next-line @typescript-eslint/no-deprecated
            provide: LAZY_FEATURE_MODULE,
            useValue: { feature: 'wishlists', providers: providersFn },
            multi: true,
          },
          provideMockStore({ selectors: [{ selector: getFeatures, value: ['wishlists'] }] }),
        ],
      });

      service = TestBed.inject(ModuleLoaderService);
      service.init();
      flush();

      expect(providersFn).toHaveBeenCalled();
    }));
  });
});
