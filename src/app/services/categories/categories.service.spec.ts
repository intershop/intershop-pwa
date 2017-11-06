import { anything, instance, mock, verify } from 'ts-mockito';
import { ApiService } from '../api.service';
import { CategoriesService } from './categories.service';

describe('Categories Service', () => {
  const apiService: ApiService = mock(ApiService);
  let categoriesService: CategoriesService;

  beforeEach(() => {
    categoriesService = new CategoriesService(instance(apiService));
  });

  it('should get top level categories when called', () => {
    categoriesService.getTopLevelCategories(0);
    verify(apiService.get(anything(), anything(), anything(), anything())).once();
  });
});
