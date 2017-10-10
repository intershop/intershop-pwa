import { Observable } from 'rxjs/Rx';
import { instance, mock, when } from 'ts-mockito';
import { ApiService } from '../api.service';
import { ProductListService } from './products.service';

describe('ProuctList Service', () => {
  let productListService: ProductListService;
  const apiService: ApiService = mock(ApiService);
  beforeEach(() => {
    productListService = new ProductListService(instance(apiService));
  });

  it('should call getProductList method', () => {
    const products = ['Product1', 'Product2'];
    const apiUrl = 'categories/Cameras-Camcorders/584/products';
    when(apiService.get(apiUrl)).thenReturn(Observable.of(products));
    let productList;
    productListService.getProductList(apiUrl).subscribe((data) => {
      productList = data;
    });
    expect(productList).toBe(products);
  });
});
