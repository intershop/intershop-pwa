import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { instance, mock, verify, when } from 'ts-mockito';

import { CategoryData } from 'ish-core/models/category/category.interface';
import { CategoriesService } from 'ish-core/services/categories/categories.service';
import { SparqueApiService } from 'ish-core/services/sparque/sparque-api/sparque-api.service';
import { categoryTree } from 'ish-core/utils/dev/test-data-utils';

import { SparqueCategoriesService } from './sparque-categories.service';

describe('Sparque Categories Service', () => {
  let apiServiceMock: SparqueApiService;
  let categoriesService: CategoriesService;
  let httpClient: HttpClient;

  beforeEach(() => {
    apiServiceMock = mock(SparqueApiService);
    httpClient = mock(HttpClient);
    when(apiServiceMock.get('e/categorytree/results?count=200')).thenReturn(
      of([{ categoryPath: [{ id: 'blubb' }] }] as CategoryData[])
    );
    TestBed.configureTestingModule({
      providers: [
        { provide: CategoriesService, useClass: SparqueCategoriesService },
        { provide: HttpClient, useFactory: () => instance(httpClient) },
        { provide: SparqueApiService, useFactory: () => instance(apiServiceMock) },
        provideMockStore(),
      ],
    });
    categoriesService = TestBed.inject(CategoriesService);
  });

  describe('getTopLevelCategories()', () => {
    it('should call ApiService "categories" when called', () => {
      categoriesService.getTopLevelCategories(0);
      verify(apiServiceMock.get('e/categorytree/results?count=200')).once();
    });

    it('should not throw when response is without categories', done => {
      when(apiServiceMock.get('e/categorytree/results?count=200')).thenReturn(of());
      categoriesService.getTopLevelCategories(0).subscribe({
        error: fail,
        complete: done,
        next: data => {
          expect(data).toEqual(categoryTree());
          verify(apiServiceMock.get('e/categorytree/results?count=200')).once();
        },
      });
    });
  });
});
