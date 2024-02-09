import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { anything, capture, instance, mock, verify, when } from 'ts-mockito';

import { Product } from 'ish-core/models/product/product.model';
import { AvailableOptions } from 'ish-core/services/api/api.service';
import { ProductsService } from 'ish-core/services/products/products.service';
import { SparqueApiService } from 'ish-core/services/sparque/sparque-api/sparque-api.service';
import { URLFormParams } from 'ish-core/utils/url-form-params';

import { SparqueProductsService } from './sparque-products.service';

describe('Sparque Products Service', () => {
  let productsService: ProductsService;
  let apiServiceMock: SparqueApiService;
  let httpClient: HttpClient;

  const categoryId = 'CategoryID';
  const productsMockData = [
    {
      offset: 0,
      count: 12,
      type: ['OBJ'],
      items: [
        {
          rank: 1,
          probability: 1.0,
          tuple: [
            {
              id: 'http://schema.org/product/ProductA',
              class: ['http://schema.org/Product'],
              attributes: {
                sku: 'ProductA',
              },
            },
          ],
        },
        {
          rank: 2,
          probability: 1.0,
          tuple: [
            {
              id: 'http://schema.org/product/ProductB',
              class: ['http://schema.org/Product'],
              attributes: {
                sku: 'ProductB',
              },
            },
          ],
        },
      ],
    },
    {
      total: 2,
      stats: [
        {
          cutoff: '1.0',
          numResults: 1,
        },
        {
          cutoff: '0.1',
          numResults: 1,
        },
      ],
    },
  ];

  beforeEach(() => {
    apiServiceMock = mock(SparqueApiService);
    httpClient = mock(HttpClient);

    TestBed.configureTestingModule({
      providers: [
        { provide: HttpClient, useFactory: () => instance(httpClient) },
        { provide: ProductsService, useClass: SparqueProductsService },
        { provide: SparqueApiService, useFactory: () => instance(apiServiceMock) },
        provideMockStore(),
      ],
    });
    productsService = TestBed.inject(ProductsService);
  });

  it("should get a list of products SKUs for a given Category when 'getCategoryProducts' is called", done => {
    when(apiServiceMock.get(anything())).thenReturn(of(productsMockData));
    const routerSpy = jest.spyOn(productsService, 'getProduct').mockImplementation(arg => of({ sku: arg } as Product));

    productsService.getCategoryProducts(categoryId, 10).subscribe(data => {
      expect(routerSpy).toHaveBeenCalledWith('ProductA');
      expect(routerSpy).toHaveBeenCalledWith('ProductB');
      expect(data.products.map(p => p.sku)).toEqual(['ProductA', 'ProductB']);
      verify(apiServiceMock.get(anything())).once();
      done();
    });
  });

  it('should get products based on the given search term', done => {
    when(apiServiceMock.get(anything())).thenReturn(of(productsMockData));
    when(apiServiceMock.getRelevantInformation$()).thenReturn(of([[], '', '']));
    const routerSpy = jest.spyOn(productsService, 'getProduct').mockImplementation(arg => of({ sku: arg } as Product));

    productsService.searchProducts('aaa', 0).subscribe(data => {
      expect(routerSpy).toHaveBeenCalledWith('ProductA');
      expect(routerSpy).toHaveBeenCalledWith('ProductB');
      expect(data.products.map(p => p.sku)).toEqual(['ProductA', 'ProductB']);
      verify(apiServiceMock.get(anything())).once();
      const [resource] = capture(apiServiceMock.get).last();
      expect(resource).toContain(`p/keyword/aaa/`);
      done();
    });
  });

  it("should get Product SKUs when 'getFilteredProducts' is called", done => {
    when(apiServiceMock.get(anything())).thenReturn(
      of([
        {
          count: 12,
          items: [{ tuple: [{ attributes: { sku: '123' } }] }, { tuple: [{ attributes: { sku: '234' } }] }],
        },
        { total: 2 },
      ])
    );
    when(apiServiceMock.getRelevantInformation$()).thenReturn(of([[], '', '']));
    const routerSpy = jest.spyOn(productsService, 'getProduct').mockImplementation(arg => of({ sku: arg } as Product));
    productsService.getFilteredProducts({ searchTerm: ['b'] } as URLFormParams, 2).subscribe(data => {
      expect(data?.products?.map(p => p.sku)).toMatchInlineSnapshot(`
        [
          "123",
          "234",
        ]
      `);
      expect(data?.total).toMatchInlineSnapshot(`2`);
      expect(data?.sortableAttributes).toMatchInlineSnapshot(`[]`);
      expect(routerSpy).toHaveBeenCalledWith('123');
      expect(routerSpy).toHaveBeenCalledWith('234');
      verify(apiServiceMock.get(anything())).once();
      const [resource] = capture<string, AvailableOptions>(apiServiceMock.get).last();
      expect(resource).toContain(`/p/keyword/b/`);
      expect(resource).toContain(`count=2`);
      done();
    });
  });
});
