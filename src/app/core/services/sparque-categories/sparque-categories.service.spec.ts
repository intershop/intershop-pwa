import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { anything, instance, mock, verify, when } from 'ts-mockito';

import { SparqueCategoryTreeResponse } from 'ish-core/models/sparque-category-tree/sparque-category-tree.interface';
import { SparqueCategoryTreeMapper } from 'ish-core/models/sparque-category-tree/sparque-category-tree.mapper';
import { SparqueApiService } from 'ish-core/services/sparque-api/sparque-api.service';
import { categoryTree } from 'ish-core/utils/dev/test-data-utils';

import { SparqueCategoriesService } from './sparque-categories.service';

describe('Sparque Categories Service', () => {
  let sparqueApiService: SparqueApiService;
  let sparqueCategoriesService: SparqueCategoriesService;
  let sparqueCategoryTreeMapper: SparqueCategoryTreeMapper;
  const apiVersion = 'v3';

  beforeEach(() => {
    sparqueApiService = mock(SparqueApiService);
    sparqueCategoryTreeMapper = mock(SparqueCategoryTreeMapper);
    when(sparqueApiService.get(anything(), apiVersion, anything())).thenReturn(
      of<SparqueCategoryTreeResponse>({ categories: [] })
    );
    when(sparqueCategoryTreeMapper.fromData(anything())).thenReturn(categoryTree());

    TestBed.configureTestingModule({
      providers: [
        { provide: SparqueApiService, useFactory: () => instance(sparqueApiService) },
        { provide: SparqueCategoryTreeMapper, useFactory: () => instance(sparqueCategoryTreeMapper) },
      ],
    });
    sparqueCategoriesService = TestBed.inject(SparqueCategoriesService);
  });

  it('should always delegate to sparque api service when called', () => {
    verify(sparqueApiService.get(anything(), apiVersion, anything())).never();

    sparqueCategoriesService.getTopLevelCategories(1);
    verify(sparqueApiService.get(anything(), apiVersion, anything())).once();
  });

  it('should map the response using SparqueCategoryTreeMapper', done => {
    const categoryTreeResponse = {
      Categories: [{ categoryID: '123', categoryName: 'Test Category', totalCount: 5 }],
    } as SparqueCategoryTreeResponse;

    when(sparqueApiService.get(anything(), apiVersion, anything())).thenReturn(
      of<SparqueCategoryTreeResponse>(categoryTreeResponse)
    );

    sparqueCategoriesService.getTopLevelCategories(1).subscribe(() => {
      verify(sparqueCategoryTreeMapper.fromData(categoryTreeResponse)).once();
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
});
