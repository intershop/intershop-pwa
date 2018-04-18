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
        attributes: [{ name: 'sku', type: 'String', value: 'ProductA' }],
      },
      {
        type: 'Link',
        uri: '/categories/CategoryID/products/ProductB',
        title: 'Product B',
        attributes: [{ name: 'sku', type: 'String', value: 'ProductB' }],
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
    when(apiService.get(`products/${productSku}`, anything(), anything(), anything(), anything())).thenReturn(
      of({ sku: productSku } as Product)
    );
    productsService.getProduct(productSku).subscribe(data => {
      expect(data.sku).toEqual(productSku);
    });
    verify(apiService.get(`products/${productSku}`, anything(), anything(), anything(), anything())).once();
  });

  it("should get a list of products SKUs for a given Category when 'getCategoryProducts' is called", () => {
    when(
      apiService.get(`categories/${categoryId}/products`, anything(), anything(), anything(), anything())
    ).thenReturn(of(productsMockData));
    productsService.getCategoryProducts(categoryId).subscribe(data => {
      expect(data.skus).toEqual(['ProductA', 'ProductB']);
      expect(data.categoryUniqueId).toEqual(categoryId);
      expect(data.sortKeys).toEqual(['name-desc', 'name-asc']);
    });
    verify(apiService.get(`categories/${categoryId}/products`, anything(), anything(), anything(), anything())).once();
  });

  it('should get products based on the given search term', () => {
    const searchTerm = 'aaa';

    when(apiService.get(anything(), anything(), anything(), anything(), anything())).thenReturn(of(productsMockData));
    productsService.searchProducts(searchTerm);

    verify(apiService.get(anything(), anything(), anything(), anything(), anything())).once();
  });
});
