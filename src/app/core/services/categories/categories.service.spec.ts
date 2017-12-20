import { HttpParams } from '@angular/common/http/src/params';
import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot } from '@angular/router';
import * as using from 'jasmine-data-provider';
import { Observable } from 'rxjs/Observable';
import { anything, capture, instance, mock, verify, when } from 'ts-mockito';
import { Category } from '../../../models/category.model';
import { ApiService } from '../api.service';
import { CategoriesService } from './categories.service';

describe('Categories Service', () => {
  let apiServiceMock: ApiService;
  let categoriesService: CategoriesService;

  beforeEach(() => {
    apiServiceMock = mock(ApiService);
    TestBed.configureTestingModule({
      providers: [
        { provide: ApiService, useFactory: () => instance(apiServiceMock) },
        CategoriesService
      ]
    });
    categoriesService = TestBed.get(CategoriesService);
  });

  describe('getTopLevelCategories()', () => {

    it('should call ApiService "categories" when called', () => {
      categoriesService.getTopLevelCategories(0);

      verify(apiServiceMock.get('categories', anything(), anything(), anything())).once();
    });

    it('should call ApiService "categories" in tree mode when called with a depth', () => {
      categoriesService.getTopLevelCategories(1);

      verify(apiServiceMock.get('categories', anything(), anything(), anything())).once();
      const args = capture(apiServiceMock.get).last();
      expect(args[0]).toBe('categories');
      const params = args[1] as HttpParams;
      expect(params).toBeTruthy();
      expect(params.get('view')).toBe('tree');
      expect(params.get('limit')).toBe('1');
    });
  });

  describe('getCategory()', () => {

    it('should call underlying ApiService categories/id when asked to resolve a category by id', () => {
      categoriesService.getCategory('dummyid');

      verify(apiServiceMock.get('categories/dummyid', anything(), anything(), anything())).once();
    });

    it('should return error when called with null', () => {
      categoriesService.getCategory(null).subscribe(data => fail(), err => expect(err).toBeTruthy());

      verify(apiServiceMock.get(anything(), anything(), anything(), anything())).never();
    });

    it('should return error when called with empty category', () => {
      categoriesService.getCategory('').subscribe(data => fail(), err => expect(err).toBeTruthy());

      verify(apiServiceMock.get(anything(), anything(), anything(), anything())).never();
    });

    it('should call underlying ApiService categories/id when asked to resolve a subcategory by id', () => {
      categoriesService.getCategory('dummyid/dummysubid');

      verify(apiServiceMock.get('categories/dummyid/dummysubid', anything(), anything(), anything())).once();
    });
  });

  describe('getCategoryPath()', () => {

    const TOP = { id: 'top' } as Category;
    const SUB = { id: 'sub' } as Category;
    const LEAF = { id: 'leaf' } as Category;

    beforeEach(() => {
      when(apiServiceMock.get(`categories/${TOP.id}`, anything(), anything(), anything())).thenReturn(Observable.of(TOP));
      when(apiServiceMock.get(`categories/${TOP.id}/${SUB.id}`, anything(), anything(), anything())).thenReturn(Observable.of(SUB));
      when(apiServiceMock.get(`categories/${TOP.id}/${SUB.id}/${LEAF.id}`, anything(), anything(), anything())).thenReturn(Observable.of(LEAF));
    });

    it('should generate the path without calling ApiService when query is a top category', () => {
      const snapshot = { url: [{ path: TOP.id }] } as ActivatedRouteSnapshot;

      categoriesService.getCategoryPath(TOP, snapshot)
        .subscribe((path: Category[]) => expect(path).toEqual([TOP]));
      verify(apiServiceMock.get(`categories/${TOP.id}`, anything(), anything(), anything())).never();
    });

    it('should generate the path with calling ApiService when query is for a sub category', () => {
      const snapshot = { url: [{ path: TOP.id }, { path: SUB.id }] } as ActivatedRouteSnapshot;

      categoriesService.getCategoryPath(SUB, snapshot)
        .subscribe((path: Category[]) => expect(path).toEqual([TOP, SUB]));

      verify(apiServiceMock.get(`categories/${TOP.id}`, anything(), anything(), anything())).once();
      verify(apiServiceMock.get(`categories/${TOP.id}/${SUB.id}`, anything(), anything(), anything())).never();
    });

    it('should generate the path with calling ApiService when query is for a leaf category', () => {
      const snapshot = { url: [{ path: TOP.id }, { path: SUB.id }, { path: LEAF.id }] } as ActivatedRouteSnapshot;

      categoriesService.getCategoryPath(LEAF, snapshot)
        .subscribe((path: Category[]) => expect(path).toEqual([TOP, SUB, LEAF]));

      verify(apiServiceMock.get(`categories/${TOP.id}`, anything(), anything(), anything())).once();
      verify(apiServiceMock.get(`categories/${TOP.id}/${SUB.id}`, anything(), anything(), anything())).once();
      verify(apiServiceMock.get(`categories/${TOP.id}/${SUB.id}/${LEAF.id}`, anything(), anything(), anything())).never();
    });

    it('should return error when called without route snapshot', () => {
      categoriesService.getCategoryPath(TOP, null)
        .subscribe(data => fail(), err => expect(err).toBeTruthy());

      verify(apiServiceMock.get(anything(), anything(), anything(), anything())).never();
    });

    it('should return error when called without category', () => {
      categoriesService.getCategoryPath(null, { url: [{ path: TOP.id }] } as ActivatedRouteSnapshot)
        .subscribe(data => fail(), err => expect(err).toBeTruthy());

      verify(apiServiceMock.get(anything(), anything(), anything(), anything())).never();
    });

    it('should return error when called with empty route', () => {
      categoriesService.getCategoryPath(TOP, { url: [] } as ActivatedRouteSnapshot)
        .subscribe(data => fail(), err => expect(err).toBeTruthy());

      verify(apiServiceMock.get(anything(), anything(), anything(), anything())).never();
    });
  });

  describe('isCategoryEqual', () => {

    function dataProvider() {
      return [
        { cat1: undefined, cat2: undefined, result: false },
        { cat1: undefined, cat2: null, result: false },
        { cat1: null, cat2: undefined, result: false },
        { cat1: null, cat2: null, result: false },
        { cat1: undefined, cat2: {}, result: false },
        { cat1: null, cat2: {}, result: false },
        { cat1: {}, cat2: undefined, result: false },
        { cat1: {}, cat2: null, result: false },
        { cat1: {}, cat2: {}, result: true },
        { cat1: { id: '1' }, cat2: { id: '1' }, result: true },
        { cat1: { id: '2' }, cat2: { id: '1' }, result: false },
        { cat1: {}, cat2: { id: '1' }, result: false },
        { cat1: { id: '1' }, cat2: {}, result: false },
        { cat1: { d: 'dummy' }, cat2: { id: '1' }, result: false },
        { cat1: { id: '1' }, cat2: { d: 'dummy' }, result: false },
        { cat1: { id: '1' }, cat2: { id: '1', d: 'dummy' }, result: true },
        { cat1: { id: '1', d: 'other' }, cat2: { id: '1', d: 'dummy' }, result: true },
      ];
    }

    using(dataProvider, (slice) => {
      it(`should return ${slice.result} when comparing '${JSON.stringify(slice.cat1)}' and '${JSON.stringify(slice.cat2)}'`, () => {
        expect(categoriesService.isCategoryEqual(slice.cat1, slice.cat2)).toBe(slice.result);
      });
    });
  });

  describe('generateCategoryRoute', () => {

    const TOP = { id: 'top' } as Category;
    const SUB = { id: 'sub' } as Category;
    const LEAF = { id: 'leaf' } as Category;

    it('should extract correct path from category.uri when supplied', () => {
      expect(categoriesService.generateCategoryRoute({ uri: 'inSPIRED-inTRONICS-Site/-/categories/Cameras-Camcorders/577' } as Category))
        .toBe('/category/Cameras-Camcorders/577');
    });

    it('should extract correct path from category.uri when supplied with spgid', () => {
      expect(categoriesService.generateCategoryRoute({ uri: 'inSPIRED-inTRONICS-Site/-/categories;spgid=rtf54sth/Cameras-Camcorders/577' } as Category))
        .toBe('/category/Cameras-Camcorders/577');
    });

    it('should generate empty result when category.uri is empty', () => {
      expect(categoriesService.generateCategoryRoute({ uri: '' } as Category)).toBe('');
    });

    it('should generate empty result when category.uri is not provided', () => {
      expect(categoriesService.generateCategoryRoute({ name: '' } as Category)).toBe('');
    });

    it('should generate empty result when category is not provided', () => {
      expect(categoriesService.generateCategoryRoute(null)).toBe('');
    });

    it('should generate route from category and simple category path when provided', () => {
      expect(categoriesService.generateCategoryRoute(TOP, [TOP]))
        .toBe(`/category/${TOP.id}`);
    });

    it('should generate route from category and complex category path when provided', () => {
      expect(categoriesService.generateCategoryRoute(LEAF, [TOP, SUB, LEAF]))
        .toBe(`/category/${TOP.id}/${SUB.id}/${LEAF.id}`);
    });

    it('should stop after provided category when using category path to generate the route', () => {
      expect(categoriesService.generateCategoryRoute(SUB, [TOP, SUB, LEAF]))
        .toBe(`/category/${TOP.id}/${SUB.id}`);
    });

    it('should not generate route when category.uri is not provided and category path is missing', () => {
      expect(categoriesService.generateCategoryRoute(LEAF, null)).toBe('');
    });

    it('should not generate route when category.uri is not provided and category path is empty', () => {
      expect(categoriesService.generateCategoryRoute(LEAF, [])).toBe('');
    });

    it('should not generate route when category without a category.uri is not part of provided category path', () => {
      expect(categoriesService.generateCategoryRoute({ id: 'dummy' } as Category, [TOP, SUB, LEAF])).toBe('');
    });

  });
});
