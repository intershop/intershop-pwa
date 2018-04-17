import { of } from 'rxjs/observable/of';
import { anything, instance, mock, verify, when } from 'ts-mockito';
import { ApiService } from '../../../core/services/api.service';
import { Product } from '../../../models/product/product.model';
import { ProductsService } from './products.service';

describe('Products Service', () => {
  let productsService: ProductsService;
  let apiService: ApiService;
  const productSku = 'SKU';
  const categoryId = 'CategoryID';
  const productsMockData = {
    elements: [
      {
        type: 'Link',
        uri: '/categories/CategoryID/products/ProductA',
        title: 'Product A',
      },
      {
        type: 'Link',
        uri: '/categories/CategoryID/products/ProductB',
        title: 'Product B',
      },
    ],
    type: 'ResourceCollection',
    sortKeys: ['name-desc', 'name-asc'],
    name: 'products',
  };

  beforeEach(() => {
    apiService = mock(ApiService);
    productsService = new ProductsService(instance(apiService));
  });

  it("should get Product data when 'getProduct' is called", () => {
    when(
      apiService.get(
        productsService.productsServiceIdentifier + productSku,
        anything(),
        anything(),
        anything(),
        anything()
      )
    ).thenReturn(of({ sku: productSku } as Product));
    productsService.getProduct(productSku).subscribe(data => {
      expect(data.sku).toEqual(productSku);
    });
    verify(
      apiService.get(
        productsService.productsServiceIdentifier + productSku,
        anything(),
        anything(),
        anything(),
        anything()
      )
    ).once();
  });

  it("should get a list of Products SKUs for a given Category when 'getProductsSkusForCategory' is called", () => {
    when(
      apiService.get(
        productsService.categoriesServiceIdentifier + categoryId + '/' + productsService.productsServiceIdentifier,
        anything(),
        anything(),
        anything(),
        anything()
      )
    ).thenReturn(of(productsMockData));
    productsService.getProductsSkusForCategory(categoryId).subscribe(data => {
      expect(data.skus).toEqual(['ProductA', 'ProductB']);
      expect(data.categoryUniqueId).toEqual(categoryId);
      expect(data.sortKeys).toEqual(['name-desc', 'name-asc']);
    });
    verify(
      apiService.get(
        productsService.categoriesServiceIdentifier + categoryId + '/' + productsService.productsServiceIdentifier,
        anything(),
        anything(),
        anything(),
        anything()
      )
    ).once();
  });

  it('should get products based on the given search term', () => {
    const products = ['Product1', 'Product2'];
    const searchTerm = 'aaa';

    when(apiService.get(anything(), anything(), anything(), anything(), anything())).thenReturn(of(products));
    productsService.searchProducts(searchTerm);

    verify(apiService.get(anything(), anything(), anything(), anything(), anything())).once();
  });
});
