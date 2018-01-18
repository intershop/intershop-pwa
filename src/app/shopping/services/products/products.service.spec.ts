import { of } from 'rxjs/observable/of';
import { anything, instance, mock, verify, when } from 'ts-mockito';
import { ApiService } from '../../../core/services/api.service';
import { ProductsService } from './products.service';

describe('ProuctList Service', () => {
  let productsService: ProductsService;
  const apiService: ApiService = mock(ApiService);
  beforeEach(() => {
    productsService = new ProductsService(instance(apiService));
  });

  it('should get product list when called', () => {
    const products = ['Product1', 'Product2'];
    const apiUrl = 'categories/Cameras-Camcorders/584/products';
    when(apiService.get(anything(), anything(), anything(), anything(), anything())).thenReturn(of(products));
    productsService.getProductList(apiUrl);
    verify(apiService.get(anything(), anything(), anything(), anything(), anything())).once();
  });
});
