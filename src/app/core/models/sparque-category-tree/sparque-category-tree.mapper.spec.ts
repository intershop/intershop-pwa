import { TestBed } from '@angular/core/testing';
import { instance, mock, when } from 'ts-mockito';

import { Category } from 'ish-core/models/category/category.model';
import { SparqueCategoryMapper } from 'ish-core/models/sparque-category/sparque-category.mapper';
import { categoryTree } from 'ish-core/utils/dev/test-data-utils';

import { SparqueCategoryTreeResponse } from './sparque-category-tree.interface';
import { SparqueCategoryTreeMapper } from './sparque-category-tree.mapper';

describe('Sparque Category Tree Mapper', () => {
  let sparqueCategoryTreeMapper: SparqueCategoryTreeMapper;
  let sparqueCategoryMapper: SparqueCategoryMapper;

  beforeEach(() => {
    sparqueCategoryMapper = mock(SparqueCategoryMapper);

    TestBed.configureTestingModule({
      providers: [{ provide: SparqueCategoryMapper, useFactory: () => instance(sparqueCategoryMapper) }],
    });

    sparqueCategoryTreeMapper = TestBed.inject(SparqueCategoryTreeMapper);
  });

  it('should return empty tree when categories array is empty', () => {
    when(sparqueCategoryMapper.fromCategoryTreeData([])).thenReturn(categoryTree());

    const response: SparqueCategoryTreeResponse = { categories: [] };
    const result = sparqueCategoryTreeMapper.fromData(response);

    expect(result).toEqual(categoryTree());
  });

  it('should return empty tree when Categories is undefined', () => {
    when(sparqueCategoryMapper.fromCategoryTreeData([])).thenReturn(categoryTree());

    const response: SparqueCategoryTreeResponse = {};
    const result = sparqueCategoryTreeMapper.fromData(response);

    expect(result).toEqual(categoryTree());
  });

  it('should delegate to SparqueCategoryMapper when Categories array is provided', () => {
    const mockSparqueCategory = [{ categoryID: '123', categoryName: 'Test Category', totalCount: 5 }];
    const mockCategory = {
      uniqueId: '123',
      categoryPath: [],
      completenessLevel: 0,
      name: 'Test Category',
    } as Category;
    const mockTree = categoryTree([mockCategory]);

    when(sparqueCategoryMapper.fromCategoryTreeData(mockSparqueCategory)).thenReturn(mockTree);

    const response: SparqueCategoryTreeResponse = { categories: mockSparqueCategory };
    const result = sparqueCategoryTreeMapper.fromData(response);

    expect(result).toEqual(mockTree);
  });
});
