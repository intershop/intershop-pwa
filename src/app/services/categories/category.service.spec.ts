import { instance, mock, verify } from 'ts-mockito';
import { ApiService } from '../';
import { CategoryService } from './category.service';

describe('Category Service', () => {
  const apiService: ApiService = mock(ApiService);
  let categoryService: CategoryService;

  beforeEach(() => {
    categoryService = new CategoryService(instance(apiService));
  });

  it('should verify that correct api is called when getCategories method is called', () => {
    categoryService.getCategories();
    verify(apiService.get('categories')).once();
  });

  it('should verify that correct api is called when getSubCategories method is called', () => {
    categoryService.getSubCategories('Cameras-Camcorders');
    verify(apiService.get('categories/Cameras-Camcorders')).once();
  });
});
