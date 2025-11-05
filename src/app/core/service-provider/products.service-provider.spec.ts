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
    it('should return ProductsService when Sparque config is not available', () => {
      configureTestBed();

      const result = productsServiceProvider.get();

      expect(result).toBe(instance(productsServiceMock));
    });

    it('should return ProductsService when skipSparque is true even if Sparque is enabled', () => {
      configureTestBed({ apiKey: 'test-key' });

      const result = productsServiceProvider.get(true);

      expect(result).toBe(instance(productsServiceMock));
    });

    it('should return SparqueProductsService when Sparque config exists and search feature is enabled', () => {
      configureTestBed({ apiKey: 'test-key', features: ['search'] });

      const result = productsServiceProvider.get();

      expect(result).toBe(instance(sparqueProductsServiceMock));
    });

    it('should return ProductsService when Sparque config exists but search feature is not in features', () => {
      configureTestBed({ apiKey: 'test-key', features: ['recommendations'] });

      const result = productsServiceProvider.get();

      expect(result).toBe(instance(productsServiceMock));
    });

    it('should return SparqueProductsService when Sparque config exists and multiple features including search are enabled', () => {
      configureTestBed({ apiKey: 'test-key', features: ['search', 'recommendations'] });

      const result = productsServiceProvider.get();

      expect(result).toBe(instance(sparqueProductsServiceMock));
    });

    it('should return ProductsService when Sparque config is null', () => {
      configureTestBed(undefined);

      const result = productsServiceProvider.get();

      expect(result).toBe(instance(productsServiceMock));
    });

    it('should return ProductsService when empty Sparque config object is provided', () => {
      configureTestBed({});

      const result = productsServiceProvider.get();

      expect(result).toBe(instance(productsServiceMock));
    });

    it('should use default parameter value for skipSparque when not provided', () => {
      configureTestBed({ apiKey: 'test-key', features: ['search'] });

      const result = productsServiceProvider.get();

      expect(result).toBe(instance(sparqueProductsServiceMock));
    });

    it('should return ProductsService when skipSparque is explicitly false but conditions are not met', () => {
      configureTestBed();

      const result = productsServiceProvider.get(false);

      expect(result).toBe(instance(productsServiceMock));
    });

    it('should return ProductsService when Sparque config has empty features array', () => {
      configureTestBed({ apiKey: 'test-key', features: [] });

      const result = productsServiceProvider.get();

      expect(result).toBe(instance(productsServiceMock));
    });
  });
});
