import { HttpParams } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot } from '@angular/router';
import { of } from 'rxjs/observable/of';
import { anything, capture, instance, mock, verify, when } from 'ts-mockito';
import { CategoryFactory } from '../../../models/category/category.factory';
import { CategoryData } from '../../../models/category/category.interface';
import { Category } from '../../../models/category/category.model';
import { ApiService } from '../api.service';
import { CategoriesService } from './categories.service';

describe('Categories Service', () => {
  let apiServiceMock: ApiService;
  let categoriesService: CategoriesService;

  beforeEach(() => {
    apiServiceMock = mock(ApiService);
    when(apiServiceMock.get('categories', anything(), anything(), anything())).thenReturn(of([{ id: 'blubb' }] as CategoryData[]));
    when(apiServiceMock.get('categories/dummyid', anything(), anything(), anything())).thenReturn(of({ id: 'blubb' } as CategoryData));
    when(apiServiceMock.get('categories/dummyid/dummysubid', anything(), anything(), anything())).thenReturn(of({ id: 'blubb' } as CategoryData));
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

  xdescribe('getCategoryPathFromRoute()', () => {

    const RAW_TOP = { id: 'top' } as CategoryData;
    const RAW_SUB = { id: 'sub' } as CategoryData;
    const RAW_LEAF = { id: 'leaf' } as CategoryData;

    const TOP = CategoryFactory.fromData(RAW_TOP);
    const SUB = CategoryFactory.fromData(RAW_SUB);
    const LEAF = CategoryFactory.fromData(RAW_LEAF);

    beforeEach(() => {
      when(apiServiceMock.get(`categories/${RAW_TOP.id}`, anything(), anything(), anything())).thenReturn(of(RAW_TOP));
      when(apiServiceMock.get(`categories/${RAW_TOP.id}/${RAW_SUB.id}`, anything(), anything(), anything())).thenReturn(of(RAW_SUB));
      when(apiServiceMock.get(`categories/${RAW_TOP.id}/${RAW_SUB.id}/${RAW_LEAF.id}`, anything(), anything(), anything())).thenReturn(of(RAW_LEAF));
    });

    it('should generate the path with calling ApiService when query is a top category', () => {
      const snapshot = { url: [{ path: RAW_TOP.id }] } as ActivatedRouteSnapshot;

      categoriesService.getCategoryPathFromRoute(snapshot)
        .subscribe((path: Category[]) => expect(path).toEqual([TOP]));
      verify(apiServiceMock.get(`categories/${RAW_TOP.id}`, anything(), anything(), anything())).once();
    });

    it('should generate the path with calling ApiService when query is for a sub category', () => {
      const snapshot = { url: [{ path: RAW_TOP.id }, { path: RAW_SUB.id }] } as ActivatedRouteSnapshot;

      categoriesService.getCategoryPathFromRoute(snapshot)
        .subscribe((path: Category[]) => { expect(path).toEqual([TOP, SUB]); });

      verify(apiServiceMock.get(`categories/${RAW_TOP.id}`, anything(), anything(), anything())).once();
      verify(apiServiceMock.get(`categories/${RAW_TOP.id}/${RAW_SUB.id}`, anything(), anything(), anything())).once();
    });

    it('should generate the path with calling ApiService when query is for a leaf category', () => {
      const snapshot = { url: [{ path: RAW_TOP.id }, { path: RAW_SUB.id }, { path: RAW_LEAF.id }] } as ActivatedRouteSnapshot;

      categoriesService.getCategoryPathFromRoute(snapshot)
        .subscribe((path: Category[]) => expect(path).toEqual([TOP, SUB, LEAF]));

      verify(apiServiceMock.get(`categories/${RAW_TOP.id}`, anything(), anything(), anything())).once();
      verify(apiServiceMock.get(`categories/${RAW_TOP.id}/${RAW_SUB.id}`, anything(), anything(), anything())).once();
      verify(apiServiceMock.get(`categories/${RAW_TOP.id}/${RAW_SUB.id}/${RAW_LEAF.id}`, anything(), anything(), anything())).once();
    });

    it('should return error when called without route snapshot', () => {
      categoriesService.getCategoryPathFromRoute(null)
        .subscribe(data => fail(), err => expect(err).toBeTruthy());

      verify(apiServiceMock.get(anything(), anything(), anything(), anything())).never();
    });

    it('should return error when called with empty route', () => {
      categoriesService.getCategoryPathFromRoute({ url: [] } as ActivatedRouteSnapshot)
        .subscribe(data => fail(), err => expect(err).toBeTruthy());

      verify(apiServiceMock.get(anything(), anything(), anything(), anything())).never();
    });
  });

  xdescribe('generateCategoryRoute', () => {

    const TOP = CategoryFactory.fromData({ id: 'top' } as CategoryData);
    const SUB = CategoryFactory.fromData({ id: 'sub' } as CategoryData);
    const LEAF = CategoryFactory.fromData({ id: 'leaf' } as CategoryData);

    it('should extract correct path from category.uri when supplied', () => {
      expect(categoriesService.generateCategoryRoute(CategoryFactory.fromData({ uri: 'inSPIRED-inTRONICS-Site/-/categories/Cameras-Camcorders/577' } as CategoryData))).toBe('/category/Cameras-Camcorders/577');
    });

    it('should extract correct path from category.uri when supplied with spgid', () => {
      expect(categoriesService.generateCategoryRoute(CategoryFactory.fromData({ uri: 'inSPIRED-inTRONICS-Site/-/categories;spgid=rtf54sth/Cameras-Camcorders/577' } as CategoryData))).toBe('/category/Cameras-Camcorders/577');
    });

    it('should generate empty result when category.uri is empty', () => {
      expect(categoriesService.generateCategoryRoute(CategoryFactory.fromData({ id: '0', name: '', uri: '' } as CategoryData))).toBe('');
    });

    it('should generate empty result when category.uri is not provided', () => {
      expect(categoriesService.generateCategoryRoute(CategoryFactory.fromData({ id: '0', name: '' } as CategoryData))).toBe('');
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
      expect(categoriesService.generateCategoryRoute(CategoryFactory.fromData({ id: 'dummy' } as CategoryData), [TOP, SUB, LEAF])).toBe('');
    });

  });
});
