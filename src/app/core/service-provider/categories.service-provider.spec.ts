import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { instance, mock } from 'ts-mockito';

import { CategoriesService } from 'ish-core/services/categories/categories.service';
import { SparqueCategoriesService } from 'ish-core/services/sparque-categories/sparque-categories.service';
import { getSparqueConfig } from 'ish-core/store/core/configuration';

import { CategoriesServiceProvider } from './categories.service-provider';

describe('Categories Service Provider', () => {
  let categoriesServiceProvider: CategoriesServiceProvider;
  let categoriesServiceMock: CategoriesService;
  let sparqueCategoriesServiceMock: SparqueCategoriesService;

  const configureTestBed = (sparqueConfig: unknown = undefined) => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        { provide: CategoriesService, useFactory: () => instance(categoriesServiceMock) },
        { provide: SparqueCategoriesService, useFactory: () => instance(sparqueCategoriesServiceMock) },
        provideMockStore({
          selectors: [{ selector: getSparqueConfig, value: sparqueConfig }],
        }),
      ],
    });

    categoriesServiceProvider = TestBed.inject(CategoriesServiceProvider);
  };

  beforeEach(() => {
    categoriesServiceMock = mock(CategoriesService);
    sparqueCategoriesServiceMock = mock(SparqueCategoriesService);
  });

  it('should be created', () => {
    configureTestBed();
    expect(categoriesServiceProvider).toBeTruthy();
  });

  describe('get', () => {
    it('should return CategoriesService when Sparque config is not available', done => {
      configureTestBed();

      categoriesServiceProvider.get().subscribe(result => {
        expect(result).toBe(instance(categoriesServiceMock));
        done();
      });
    });

    it('should return CategoriesService when Sparque config exists but no features are defined', done => {
      configureTestBed({ apiKey: 'test-key' });

      categoriesServiceProvider.get().subscribe(result => {
        expect(result).toBe(instance(categoriesServiceMock));
        done();
      });
    });

    it('should return CategoriesService when Sparque config exists but category feature is not in features', done => {
      configureTestBed({ apiKey: 'test-key', features: ['search', 'recommendations'] });

      categoriesServiceProvider.get().subscribe(result => {
        expect(result).toBe(instance(categoriesServiceMock));
        done();
      });
    });

    it('should return SparqueCategoriesService when Sparque config exists and category feature is enabled', done => {
      configureTestBed({ apiKey: 'test-key', features: ['category'] });

      categoriesServiceProvider.get().subscribe(result => {
        expect(result).toBe(instance(sparqueCategoriesServiceMock));
        done();
      });
    });

    it('should return SparqueCategoriesService when Sparque config exists and multiple features including category are enabled', done => {
      configureTestBed({ apiKey: 'test-key', features: ['search', 'category', 'recommendations'] });

      categoriesServiceProvider.get().subscribe(result => {
        expect(result).toBe(instance(sparqueCategoriesServiceMock));
        done();
      });
    });

    it('should return CategoriesService when Sparque config is null', done => {
      configureTestBed(undefined);

      categoriesServiceProvider.get().subscribe(result => {
        expect(result).toBe(instance(categoriesServiceMock));
        done();
      });
    });

    it('should return CategoriesService when Sparque config is undefined', done => {
      configureTestBed(undefined);

      categoriesServiceProvider.get().subscribe(result => {
        expect(result).toBe(instance(categoriesServiceMock));
        done();
      });
    });

    it('should return CategoriesService when empty Sparque config object is provided', done => {
      configureTestBed({});

      categoriesServiceProvider.get().subscribe(result => {
        expect(result).toBe(instance(categoriesServiceMock));
        done();
      });
    });

    it('should return CategoriesService when config is falsy value', done => {
      configureTestBed(false);

      categoriesServiceProvider.get().subscribe(result => {
        expect(result).toBe(instance(categoriesServiceMock));
        done();
      });
    });

    it('should return CategoriesService when config is zero', done => {
      configureTestBed(0);

      categoriesServiceProvider.get().subscribe(result => {
        expect(result).toBe(instance(categoriesServiceMock));
        done();
      });
    });

    it('should return CategoriesService when config is empty string', done => {
      configureTestBed('');

      categoriesServiceProvider.get().subscribe(result => {
        expect(result).toBe(instance(categoriesServiceMock));
        done();
      });
    });

    it('should return CategoriesService when Sparque config has empty features array', done => {
      configureTestBed({ apiKey: 'test-key', features: [] });

      categoriesServiceProvider.get().subscribe(result => {
        expect(result).toBe(instance(categoriesServiceMock));
        done();
      });
    });

    it('should return CategoriesService when features array exists but does not include category', done => {
      configureTestBed({ apiKey: 'test-key', features: ['search', 'recommendations', 'other_feature'] });

      categoriesServiceProvider.get().subscribe(result => {
        expect(result).toBe(instance(categoriesServiceMock));
        done();
      });
    });

    it('should prioritize SparqueCategoriesService when both config and category feature are properly set', done => {
      configureTestBed({
        apiKey: 'test-key',
        baseUrl: 'https://api.sparque.ai',
        features: ['category'],
      });

      categoriesServiceProvider.get().subscribe(result => {
        expect(result).toBe(instance(sparqueCategoriesServiceMock));
        expect(result).not.toBe(instance(categoriesServiceMock));
        done();
      });
    });

    it('should return CategoriesService when features is not an array', done => {
      configureTestBed({ apiKey: 'test-key', features: 'category' });

      categoriesServiceProvider.get().subscribe(result => {
        expect(result).toBe(instance(categoriesServiceMock));
        done();
      });
    });

    it('should return CategoriesService when features is null', done => {
      configureTestBed({ apiKey: 'test-key', features: undefined });

      categoriesServiceProvider.get().subscribe(result => {
        expect(result).toBe(instance(categoriesServiceMock));
        done();
      });
    });

    it('should return SparqueCategoriesService when category feature is present with mixed case', done => {
      configureTestBed({ apiKey: 'test-key', features: ['Category'] });

      categoriesServiceProvider.get().subscribe(result => {
        expect(result).toBe(instance(categoriesServiceMock));
        done();
      });
    });

    it('should return SparqueCategoriesService when category is the only feature', done => {
      configureTestBed({ apiKey: 'test-key', features: ['category'] });

      categoriesServiceProvider.get().subscribe(result => {
        expect(result).toBe(instance(sparqueCategoriesServiceMock));
        done();
      });
    });
  });
});
