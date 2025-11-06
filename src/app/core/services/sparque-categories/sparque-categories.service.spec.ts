import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { anything, capture, instance, mock, verify, when } from 'ts-mockito';

import { SparqueCategory } from 'ish-core/models/sparque-category/sparque-category.interface';
import { SparqueCategoryMapper } from 'ish-core/models/sparque-category/sparque-category.mapper';
import { AvailableOptions } from 'ish-core/services/api/api.service';
import { SparqueApiService } from 'ish-core/services/sparque-api/sparque-api.service';
import { categoryTree } from 'ish-core/utils/dev/test-data-utils';

import { SparqueCategoriesService } from './sparque-categories.service';

describe('Sparque Categories Service', () => {
  let sparqueApiService: SparqueApiService;
  let sparqueCategoriesService: SparqueCategoriesService;
  let sparqueCategoryMapper: SparqueCategoryMapper;
  const apiVersion = 'v3';

  beforeEach(() => {
    sparqueApiService = mock(SparqueApiService);
    sparqueCategoryMapper = mock(SparqueCategoryMapper);
    when(sparqueApiService.get(anything(), apiVersion, anything())).thenReturn(
      of<{ categories?: SparqueCategory[] }>({ categories: [] })
    );
    when(sparqueCategoryMapper.fromCategoryTreeData(anything())).thenReturn(categoryTree());
    when(sparqueCategoryMapper.fromCategoryTreeData(anything(), anything())).thenReturn(categoryTree());

    TestBed.configureTestingModule({
      providers: [
        { provide: SparqueApiService, useFactory: () => instance(sparqueApiService) },
        { provide: SparqueCategoryMapper, useFactory: () => instance(sparqueCategoryMapper) },
      ],
    });
    sparqueCategoriesService = TestBed.inject(SparqueCategoriesService);
  });

  it('should always delegate to sparque api service when called', () => {
    verify(sparqueApiService.get(anything(), apiVersion, anything())).never();

    sparqueCategoriesService.getTopLevelCategories(1);
    verify(sparqueApiService.get(anything(), apiVersion, anything())).once();
  });

  it('should map the response using SparqueCategoryMapper', done => {
    const categoryTreeResponse = {
      categories: [{ categoryID: '123', categoryName: 'Test Category', totalCount: 5 }],
    } as { categories?: SparqueCategory[] };

    when(sparqueApiService.get(anything(), apiVersion, anything())).thenReturn(
      of<{ categories?: SparqueCategory[] }>(categoryTreeResponse)
    );

    sparqueCategoriesService.getTopLevelCategories(1).subscribe(() => {
      verify(sparqueCategoryMapper.fromCategoryTreeData(categoryTreeResponse.categories)).once();
      done();
    });
  });

  it('should set Levels parameter when limit is greater than 0', () => {
    sparqueCategoriesService.getTopLevelCategories(2);
    verify(sparqueApiService.get('categorytree', apiVersion, anything())).once();
  });

  it('should not set Levels parameter when limit is 0', () => {
    sparqueCategoriesService.getTopLevelCategories(0);
    verify(sparqueApiService.get('categorytree', apiVersion, anything())).once();
  });

  describe('getCategory', () => {
    it('should call sparque api service with categorytree endpoint', () => {
      sparqueCategoriesService.getCategory('A.B.C');
      verify(sparqueApiService.get('categorytree', apiVersion, anything())).once();
    });

    it('should set EntryCategoryId and Levels parameters correctly', () => {
      sparqueCategoriesService.getCategory('A.B.C');

      // The third parameter should contain the HttpParams with EntryCategoryId and Levels
      const capturedCall = capture<string, string, AvailableOptions>(sparqueApiService.get).last();
      const [endpoint, version, options] = capturedCall;
      expect(endpoint).toBe('categorytree');
      expect(version).toBe('v3');
      expect(options?.params?.get('EntryCategoryId')).toBe('C'); // CategoryHelper.getCategoryID('A.B.C') returns 'C'
      expect(options?.params?.get('Levels')).toBe('3'); // 'A.B.C'.split('.').length = 3
    });

    it('should map the response using SparqueCategoryMapper', done => {
      const categoryTreeResponse = {
        categories: [{ categoryID: 'A.B.C', categoryName: 'Test Category', totalCount: 3 }],
      } as { categories?: SparqueCategory[] };

      when(sparqueApiService.get(anything(), apiVersion, anything())).thenReturn(
        of<{ categories?: SparqueCategory[] }>(categoryTreeResponse)
      );

      sparqueCategoriesService.getCategory('A.B.C').subscribe(() => {
        verify(sparqueCategoryMapper.fromCategoryTreeData(categoryTreeResponse.categories, anything())).once();
        done();
      });
    });
  });
});
