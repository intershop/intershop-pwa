import { Observable } from 'rxjs/Rx';
import { instance, mock, when, anything, verify } from 'ts-mockito';
import { ApiService } from '../api.service';
import { ProductListService } from './products.service';

describe('ProuctList Service', () => {
  let productListService: ProductListService;
  const apiService: ApiService = mock(ApiService);
  beforeEach(() => {
    productListService = new ProductListService(instance(apiService));
  });

  it('should call getProductList method and confirm apiService.get method is called once', () => {
    const products = ['Product1', 'Product2'];
    const apiUrl = 'categories/Cameras-Camcorders/584/products';
    when(apiService.get(anything(), anything(), anything(), anything(), anything())).thenReturn(Observable.of(products));
    productListService.getProductList(apiUrl);
    verify(apiService.get(anything(), anything(), anything(), anything(), anything())).once();
  });
});
