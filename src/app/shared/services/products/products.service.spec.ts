import { Observable } from 'rxjs/Observable';
import { anything, instance, mock, verify, when } from 'ts-mockito';
import { ApiService } from '../../../core/services/api.service';
import { ProductListService } from './products.service';

describe('ProuctList Service', () => {
  let productListService: ProductListService;
  const apiService: ApiService = mock(ApiService);
  beforeEach(() => {
    productListService = new ProductListService(instance(apiService));
  });

  it('should get product list when called', () => {
    const products = ['Product1', 'Product2'];
    const apiUrl = 'categories/Cameras-Camcorders/584/products';
    when(apiService.get(anything(), anything(), anything(), anything(), anything())).thenReturn(Observable.of(products));
    productListService.getProductList(apiUrl);
    verify(apiService.get(anything(), anything(), anything(), anything(), anything())).once();
  });
});
