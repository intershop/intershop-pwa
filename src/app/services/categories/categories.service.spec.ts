import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { anything, capture, instance, mock, verify, when } from 'ts-mockito';
import { ApiService } from '../api.service';
import { Category } from './categories.model';
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
      const params = args[1];
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
});
