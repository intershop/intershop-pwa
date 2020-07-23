import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { anything, capture, instance, mock, verify, when } from 'ts-mockito';

import { CategoryData } from 'ish-core/models/category/category.interface';
import { ApiService, AvailableOptions } from 'ish-core/services/api/api.service';
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
      providers: [{ provide: ApiService, useFactory: () => instance(apiServiceMock) }, provideMockStore()],
    });
    categoriesService = TestBed.inject(CategoriesService);
  });

  describe('getTopLevelCategories()', () => {
    it('should call ApiService "categories" when called', () => {
      categoriesService.getTopLevelCategories(0);
      verify(apiServiceMock.get('categories', anything())).once();
    });

    it('should call ApiService "categories" in tree mode when called with a depth', () => {
      categoriesService.getTopLevelCategories(1);
      verify(apiServiceMock.get('categories', anything())).once();

      expect(capture(apiServiceMock.get).last()[0].toString()).toMatchInlineSnapshot(`"categories"`);
      const options: AvailableOptions = capture(apiServiceMock.get).last()[1];
      expect(options.params.toString()).toMatchInlineSnapshot(
        `"imageView=NO-IMAGE&view=tree&limit=1&omitHasOnlineProducts=true"`
      );
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
