import { HttpParams } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { anything, capture, instance, mock, verify, when } from 'ts-mockito';

import { CategoryData } from 'ish-core/models/category/category.interface';
import { ApiService } from 'ish-core/services/api/api.service';
import { configurationReducer } from 'ish-core/store/configuration/configuration.reducer';
import { ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';
import { categoryTree } from 'ish-core/utils/dev/test-data-utils';

import { CategoriesService } from './categories.service';

describe('Categories Service', () => {
  let apiServiceMock: ApiService;
  let categoriesService: CategoriesService;

  beforeEach(() => {
    apiServiceMock = mock(ApiService);
    when(apiServiceMock.get('categories', anything())).thenReturn(
      of([{ categoryPath: [{ id: 'blubb' }] }] as CategoryData[])
    );
    when(apiServiceMock.get('categories/dummyid')).thenReturn(of({ categoryPath: [{ id: 'blubb' }] } as CategoryData));
    when(apiServiceMock.get('categories/dummyid/dummysubid')).thenReturn(
      of({ categoryPath: [{ id: 'blubb' }] } as CategoryData)
    );
    TestBed.configureTestingModule({
      imports: [
        ngrxTesting({
          reducers: {
            configuration: configurationReducer,
          },
        }),
      ],
      providers: [{ provide: ApiService, useFactory: () => instance(apiServiceMock) }],
    });
    categoriesService = TestBed.get(CategoriesService);
  });

  describe('getTopLevelCategories()', () => {
    it('should call ApiService "categories" when called', () => {
      categoriesService.getTopLevelCategories(0);
      verify(apiServiceMock.get('categories', anything())).once();
    });

    it('should call ApiService "categories" in tree mode when called with a depth', () => {
      categoriesService.getTopLevelCategories(1);
      verify(apiServiceMock.get('categories', anything())).once();

      const args = capture(apiServiceMock.get).last();
      expect(args[0]).toBe('categories');
      // tslint:disable-next-line:no-any
      const params = (args[1] as any).params as HttpParams;
      expect(params).toBeTruthy();
      expect(params.get('view')).toBe('tree');
      expect(params.get('limit')).toBe('1');
    });

    it('should not throw when response is without categories', done => {
      when(apiServiceMock.get('categories', anything())).thenReturn(of({ elements: [] }));
      categoriesService.getTopLevelCategories(0).subscribe({
        error: fail,
        complete: done,
        next: data => {
          expect(data).toEqual(categoryTree());
          verify(apiServiceMock.get('categories', anything())).once();
        },
      });
    });
  });

  describe('getCategory()', () => {
    it('should call underlying ApiService categories/id when asked to resolve a category by id', () => {
      categoriesService.getCategory('dummyid');

      verify(apiServiceMock.get('categories/dummyid')).once();
    });

    it('should return error when called with undefined', done => {
      categoriesService.getCategory(undefined).subscribe(fail, err => {
        expect(err).toBeTruthy();
        done();
      });

      verify(apiServiceMock.get(anything())).never();
    });

    it('should return error when called with empty category', done => {
      categoriesService.getCategory('').subscribe(fail, err => {
        expect(err).toBeTruthy();
        done();
      });

      verify(apiServiceMock.get(anything(), anything())).never();
    });

    it('should call underlying ApiService categories/id when asked to resolve a subcategory by id', () => {
      categoriesService.getCategory('dummyid/dummysubid');
      verify(apiServiceMock.get('categories/dummyid/dummysubid')).once();
    });
  });
});
