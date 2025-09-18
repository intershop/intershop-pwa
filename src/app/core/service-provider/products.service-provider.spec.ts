import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { instance, mock } from 'ts-mockito';

import { ProductsService } from 'ish-core/services/products/products.service';
import { SparqueProductsService } from 'ish-core/services/sparque-products/sparque-products.service';
import { getSparqueConfig } from 'ish-core/store/core/configuration';

import { ProductsServiceProvider } from './products.service-provider';

describe('Products Service Provider', () => {
  let productsServiceProvider: ProductsServiceProvider;
  let productsServiceMock: ProductsService;
  let sparqueProductsServiceMock: SparqueProductsService;

  const configureTestBed = (sparqueConfig: unknown = undefined) => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        { provide: ProductsService, useFactory: () => instance(productsServiceMock) },
        { provide: SparqueProductsService, useFactory: () => instance(sparqueProductsServiceMock) },
        provideMockStore({
          selectors: [{ selector: getSparqueConfig, value: sparqueConfig }],
        }),
      ],
    });
    productsServiceProvider = TestBed.inject(ProductsServiceProvider);
  };

  beforeEach(() => {
    productsServiceMock = mock(ProductsService);
    sparqueProductsServiceMock = mock(SparqueProductsService);
  });

  it('should be created', () => {
    configureTestBed();
    expect(productsServiceProvider).toBeTruthy();
  });

  describe('get', () => {
    it('should return ProductsService when Sparque config is not available', done => {
      configureTestBed();

      productsServiceProvider.get().subscribe(result => {
        expect(result).toBe(instance(productsServiceMock));
        done();
      });
    });

    it('should return ProductsService when skipSparque is true even if Sparque is enabled', done => {
      configureTestBed({ apiKey: 'test-key' });

      productsServiceProvider.get(true).subscribe(result => {
        expect(result).toBe(instance(productsServiceMock));
        done();
      });
    });

    it('should return SparqueProductsService when Sparque config exists and search feature is enabled', done => {
      configureTestBed({ apiKey: 'test-key', features: ['search'] });

      productsServiceProvider.get().subscribe(result => {
        expect(result).toBe(instance(sparqueProductsServiceMock));
        done();
      });
    });

    it('should return ProductsService when Sparque config exists but search feature is not in features', done => {
      configureTestBed({ apiKey: 'test-key', features: ['recommendations'] });

      productsServiceProvider.get().subscribe(result => {
        expect(result).toBe(instance(productsServiceMock));
        done();
      });
    });

    it('should return SparqueProductsService when Sparque config exists and multiple features including search are enabled', done => {
      configureTestBed({ apiKey: 'test-key', features: ['search', 'recommendations'] });

      productsServiceProvider.get().subscribe(result => {
        expect(result).toBe(instance(sparqueProductsServiceMock));
        done();
      });
    });

    it('should return ProductsService when Sparque config is null', done => {
      configureTestBed(undefined);

      productsServiceProvider.get().subscribe(result => {
        expect(result).toBe(instance(productsServiceMock));
        done();
      });
    });

    it('should return ProductsService when empty Sparque config object is provided', done => {
      configureTestBed({});

      productsServiceProvider.get().subscribe(result => {
        expect(result).toBe(instance(productsServiceMock));
        done();
      });
    });

    it('should use default parameter value for skipSparque when not provided', done => {
      configureTestBed({ apiKey: 'test-key', features: ['search'] });

      productsServiceProvider.get().subscribe(result => {
        expect(result).toBe(instance(sparqueProductsServiceMock));
        done();
      });
    });

    it('should return ProductsService when skipSparque is explicitly false but conditions are not met', done => {
      configureTestBed();

      productsServiceProvider.get(false).subscribe(result => {
        expect(result).toBe(instance(productsServiceMock));
        done();
      });
    });

    it('should return ProductsService when Sparque config has empty features array', done => {
      configureTestBed({ apiKey: 'test-key', features: [] });

      productsServiceProvider.get().subscribe(result => {
        expect(result).toBe(instance(productsServiceMock));
        done();
      });
    });
  });
});
