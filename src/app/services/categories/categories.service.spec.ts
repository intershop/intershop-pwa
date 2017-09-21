import { anything, instance, mock, verify } from 'ts-mockito';
import { ApiService } from '../';
import { CategoriesService } from './categories.service';

describe('Category Service', () => {
  const apiService: ApiService = mock(ApiService);
  let categoriesService: CategoriesService;

  beforeEach(() => {
    categoriesService = new CategoriesService(instance(apiService));
  });

  it('should verify that correct api is called when getCategories method is called', () => {
    categoriesService.getCategories('uri');
    verify(apiService.get(anything(), anything(), anything(), anything())).once();
  });
});
