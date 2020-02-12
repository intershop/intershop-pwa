import { TestBed } from '@angular/core/testing';
import { Router, UrlMatchResult, UrlSegment } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { cold } from 'jest-marbles';
import { RouteNavigation } from 'ngrx-router';
import { of } from 'rxjs';

import { createCategoryView } from 'ish-core/models/category-view/category-view.model';
import { Category } from 'ish-core/models/category/category.model';
import { categoryTree } from 'ish-core/utils/dev/test-data-utils';

import {
  generateCategoryUrl,
  generateLocalizedCategorySlug,
  matchCategoryRoute,
  ofCategoryRoute,
} from './category.route';

describe('Category Route', () => {
  const specials = { categoryPath: ['Specials'], uniqueId: 'Specials', name: 'Spezielles' } as Category;
  const topSeller = {
    categoryPath: ['Specials', 'Specials.TopSeller'],
    uniqueId: 'Specials.TopSeller',
    name: 'Angebote',
  } as Category;
  const limitedOffer = {
    categoryPath: ['Specials', 'Specials.TopSeller', 'Specials.TopSeller.LimitedOffer'],
    uniqueId: 'Specials.TopSeller.LimitedOffer',
    name: 'Black Friday',
  } as Category;

  expect.addSnapshotSerializer({
    test: val => val && val.consumed && val.posParams,
    print: (val: UrlMatchResult, serialize) =>
      serialize(
        Object.keys(val.posParams)
          .map(key => ({ [key]: val.posParams[key].path }))
          .reduce((acc, v) => ({ ...acc, ...v }), {})
      ),
  });

  let wrap: (url: string) => UrlSegment[];

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [RouterTestingModule] });
    const router: Router = TestBed.get(Router);
    wrap = url => {
      const primary = router.parseUrl(url).root.children.primary;
      return primary ? primary.segments : [];
    };
  });

  describe('without anything', () => {
    it('should be created', () => {
      expect(generateCategoryUrl(undefined)).toMatchInlineSnapshot(`"/"`);
    });

    it('should not be a match for matcher', () => {
      expect(matchCategoryRoute(wrap(generateCategoryUrl(undefined)))).toMatchInlineSnapshot(`undefined`);
    });
  });

  describe('with top level category without name', () => {
    const category = createCategoryView(categoryTree([{ ...specials, name: undefined }]), specials.uniqueId);

    it('should be created', () => {
      expect(generateCategoryUrl(category)).toMatchInlineSnapshot(`"/catSpecials"`);
    });

    it('should not be a match for matcher', () => {
      expect(matchCategoryRoute(wrap(generateCategoryUrl(category)))).toMatchInlineSnapshot(`
        Object {
          "categoryUniqueId": "Specials",
        }
      `);
    });
  });

  describe('with top level category', () => {
    const category = createCategoryView(categoryTree([specials]), specials.uniqueId);

    it('should be created', () => {
      expect(generateCategoryUrl(category)).toMatchInlineSnapshot(`"/Spezielles-catSpecials"`);
    });

    it('should not be a match for matcher', () => {
      expect(matchCategoryRoute(wrap(generateCategoryUrl(category)))).toMatchInlineSnapshot(`
        Object {
          "categoryUniqueId": "Specials",
        }
      `);
    });
  });

  describe('with deep category', () => {
    const category = createCategoryView(categoryTree([specials, topSeller, limitedOffer]), limitedOffer.uniqueId);

    it('should be created', () => {
      expect(generateCategoryUrl(category)).toMatchInlineSnapshot(`"/Black-Friday-catSpecials.TopSeller.LimitedOffer"`);
    });

    it('should not be a match for matcher', () => {
      expect(matchCategoryRoute(wrap(generateCategoryUrl(category)))).toMatchInlineSnapshot(`
        Object {
          "categoryUniqueId": "Specials.TopSeller.LimitedOffer",
        }
      `);
    });
  });

  describe('compatibility', () => {
    it('should detect category route without product after it', () => {
      expect(matchCategoryRoute(wrap('/category/123'))).toHaveProperty('consumed');
    });

    it('should not detect category route with product after it', () => {
      expect(matchCategoryRoute(wrap('/category/123/product/123'))).toBeUndefined();
    });
  });

  describe('additional URL params', () => {
    it('should ignore additional URL params when supplied', () => {
      const category = createCategoryView(categoryTree([specials, topSeller, limitedOffer]), limitedOffer.uniqueId);
      expect(matchCategoryRoute(wrap(generateCategoryUrl(category) + ';lang=de_DE;redirect=1'))).toMatchInlineSnapshot(`
        Object {
          "categoryUniqueId": "Specials.TopSeller.LimitedOffer",
        }
      `);
    });
  });

  describe('ofCategoryRoute', () => {
    it('should detect category route when categoryUniqueId is a param', () => {
      const stream$ = of(new RouteNavigation({ path: 'any', params: { categoryUniqueId: '123' } }));
      expect(stream$.pipe(ofCategoryRoute())).toBeObservable(
        cold('(a|)', {
          a: new RouteNavigation({
            params: {
              categoryUniqueId: '123',
            },
            path: 'any',
            url: '/any',
          }),
        })
      );
    });

    it('should not detect category route when categoryUniqueId is missing', () => {
      const stream$ = of(new RouteNavigation({ path: 'any' }));

      expect(stream$.pipe(ofCategoryRoute())).toBeObservable(cold('|'));
    });

    it('should not detect category route when categoryUniqueId and sku are params', () => {
      const stream$ = of(new RouteNavigation({ path: 'any', params: { categoryUniqueId: '123', sku: '123' } }));

      expect(stream$.pipe(ofCategoryRoute())).toBeObservable(cold('|'));
    });
  });

  describe('generateLocalizedCategorySlug', () => {
    it('should generate slug for top level category', () => {
      const category = createCategoryView(categoryTree([specials]), specials.uniqueId);
      expect(generateLocalizedCategorySlug(category)).toMatchInlineSnapshot(`"Spezielles"`);
    });

    it('should generate slug for deep category', () => {
      const category = createCategoryView(categoryTree([specials, topSeller, limitedOffer]), limitedOffer.uniqueId);
      expect(generateLocalizedCategorySlug(category)).toMatchInlineSnapshot(`"Black-Friday"`);
    });

    it('should return empty string when category is unavailable', () => {
      expect(generateLocalizedCategorySlug(undefined)).toMatchInlineSnapshot(`""`);
    });
  });
});
