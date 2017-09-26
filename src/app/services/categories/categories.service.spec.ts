import { anything, instance, mock, verify } from 'ts-mockito';
import { ApiService } from '../';
import { CategoriesService } from './categories.service';

describe('Categories Service', () => {
  const apiService: ApiService = mock(ApiService);
  let categoriesService: CategoriesService;

  beforeEach(() => {
    categoriesService = new CategoriesService(instance(apiService));
  });

  it(`should verify that api service's get method is called when getCategories method is called`, () => {
    categoriesService.getCategories('uri');
    verify(apiService.get(anything(), anything(), anything(), anything())).once();
  });
});
