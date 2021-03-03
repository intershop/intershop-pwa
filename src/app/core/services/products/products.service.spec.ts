import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { anything, capture, instance, mock, verify, when } from 'ts-mockito';

import { Product } from 'ish-core/models/product/product.model';
import { ApiService, AvailableOptions } from 'ish-core/services/api/api.service';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { ProductListingEffects } from 'ish-core/store/shopping/product-listing/product-listing.effects';
import { ShoppingStoreModule } from 'ish-core/store/shopping/shopping-store.module';

import { ProductsService } from './products.service';

describe('Products Service', () => {
  let productsService: ProductsService;
  let apiServiceMock: ApiService;

  const productSku = 'SKU';
  const categoryId = 'CategoryID';
  const productsMockData = {
    elements: [
      {
        type: 'Link',
        uri: '/categories/CategoryID/products/ProductA',
        title: 'Product A',
        attributes: [{ name: 'sku', type: 'String', value: 'ProductA' }],
        attributeGroup: {
          name: 'attrGroupA',
          attributes: [
            {
              name: 'attrNameA',
              type: 'Boolean',
              value: true,
            },
          ],
        },
      },
      {
        type: 'Link',
        uri: '/categories/CategoryID/products/ProductB',
        title: 'Product B',
        attributes: [{ name: 'sku', type: 'String', value: 'ProductB' }],
        attributeGroup: {
          name: 'attrGroupB',
          attributes: [
            {
              name: 'attrNameB',
              type: 'Boolean',
              value: true,
            },
          ],
        },
      },
    ],
    type: 'ResourceCollection',
    sortableAttributes: {
      'name-desc': { name: 'name-desc' },
      'name-asc': { name: 'name-asc' },
    },
    name: 'products',
  };

  beforeEach(() => {
    apiServiceMock = mock(ApiService);
    TestBed.configureTestingModule({
      imports: [
        CoreStoreModule.forTesting(['configuration'], [ProductListingEffects]),
        ShoppingStoreModule.forTesting('productListing'),
      ],
      providers: [{ provide: ApiService, useFactory: () => instance(apiServiceMock) }],
    });
    productsService = TestBed.inject(ProductsService);
  });

  it("should get Product data when 'getProduct' is called", done => {
    when(apiServiceMock.get(`products/${productSku}`, anything())).thenReturn(of({ sku: productSku } as Product));
    productsService.getProduct(productSku).subscribe(data => {
      expect(data.sku).toEqual(productSku);
      verify(apiServiceMock.get(`products/${productSku}`, anything())).once();
      done();
    });
  });

  it("should get a list of products SKUs for a given Category when 'getCategoryProducts' is called", done => {
    when(apiServiceMock.get(`categories/${categoryId}/products`, anything())).thenReturn(of(productsMockData));
    productsService.getCategoryProducts(categoryId, 0).subscribe(data => {
      expect(data.products.map(p => p.sku)).toEqual(['ProductA', 'ProductB']);
      expect(data.sortableAttributes).toMatchInlineSnapshot(`
        Array [
          Object {
            "name": "name-desc",
          },
          Object {
            "name": "name-asc",
          },
        ]
      `);
      verify(apiServiceMock.get(`categories/${categoryId}/products`, anything())).once();
      done();
    });
  });

  it('should get products based on the given search term', () => {
    const searchTerm = 'aaa';

    when(apiServiceMock.get(anything(), anything())).thenReturn(of(productsMockData));
    productsService.searchProducts(searchTerm, 0);

    verify(apiServiceMock.get(anything(), anything())).once();
  });

  it("should get product variations data when 'getProductVariations' is called", done => {
    when(apiServiceMock.get(`products/${productSku}/variations`)).thenReturn(of({ elements: [] }));
    productsService.getProductVariations(productSku).subscribe(() => {
      verify(apiServiceMock.get(`products/${productSku}/variations`)).once();
      done();
    });
  });

  it("should get all product variations data when 'getProductVariations' is called and more than 50 variations exist", done => {
    when(apiServiceMock.get(`products/${productSku}/variations`)).thenReturn(
      of({ elements: [], amount: 50, total: 56 })
    );
    when(apiServiceMock.get(`products/${productSku}/variations`, anything())).thenReturn(
      of({ elements: [], amount: 6, total: 56 })
    );
    productsService.getProductVariations(productSku).subscribe(() => {
      verify(apiServiceMock.get(`products/${productSku}/variations`)).once();
      verify(apiServiceMock.get(`products/${productSku}/variations`, anything())).once();
      const [, args] = capture<string, AvailableOptions>(apiServiceMock.get).last();
      expect(args.params).toBeTruthy();
      expect(args.params.toString()).toMatchInlineSnapshot(`"amount=6&offset=50"`);
      done();
    });
  });

  it("should get product bundles data when 'getProductBundles' is called", done => {
    when(apiServiceMock.get(`products/${productSku}/bundles`)).thenReturn(of([]));
    productsService.getProductBundles(productSku).subscribe(() => {
      verify(apiServiceMock.get(`products/${productSku}/bundles`)).once();
      done();
    });
  });

  it("should get retail set parts data when 'getRetailSetParts' is called", done => {
    when(apiServiceMock.get(`products/${productSku}/partOfRetailSet`)).thenReturn(of([]));
    productsService.getRetailSetParts(productSku).subscribe(() => {
      verify(apiServiceMock.get(`products/${productSku}/partOfRetailSet`)).once();
      done();
    });
  });

  it("should get product links data when 'getProductLinks' is called", done => {
    when(apiServiceMock.get(`products/${productSku}/links`)).thenReturn(of([]));
    productsService.getProductLinks(productSku).subscribe(() => {
      verify(apiServiceMock.get(`products/${productSku}/links`)).once();
      done();
    });
  });

  it("should get map product links data when 'getProductLinks' is called", done => {
    when(apiServiceMock.get(`products/${productSku}/links`)).thenReturn(
      of({
        elements: [
          {
            linkType: 'replacement',
            productLinks: [
              {
                uri: 'inSPIRED-inTRONICS-Site/-/products/9438012',
              },
              {
                uri: 'inSPIRED-inTRONICS-Site/-/products/5910874',
              },
            ],
          },
          {
            linkType: 'crossselling',
            categoryLinks: [
              {
                uri: 'inSPIRED-inTRONICS-Site/-/categories/Cameras-Camcorders',
              },
            ],
            productLinks: [
              {
                uri: 'inSPIRED-inTRONICS-Site/-/products/341951',
              },
            ],
          },
        ],
      })
    );

    productsService.getProductLinks(productSku).subscribe(links => {
      expect(links).toMatchInlineSnapshot(`
        Object {
          "crossselling": Object {
            "categories": Array [
              "Cameras-Camcorders",
            ],
            "products": Array [
              "341951",
            ],
          },
          "replacement": Object {
            "categories": Array [],
            "products": Array [
              "9438012",
              "5910874",
            ],
          },
        }
      `);
      done();
    });
  });
});
