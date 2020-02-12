import { TestBed } from '@angular/core/testing';
import { Router, UrlMatchResult, UrlSegment } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { cold } from 'jest-marbles';
import { RouteNavigation } from 'ngrx-router';
import { of } from 'rxjs';

import { createCategoryView } from 'ish-core/models/category-view/category-view.model';
import { Category } from 'ish-core/models/category/category.model';
import { createProductView } from 'ish-core/models/product-view/product-view.model';
import { VariationProduct } from 'ish-core/models/product/product-variation.model';
import { Product } from 'ish-core/models/product/product.model';
import { categoryTree } from 'ish-core/utils/dev/test-data-utils';

import { generateProductUrl, matchProductRoute, ofProductRoute } from './product.route';

describe('Product Route', () => {
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
      expect(generateProductUrl(undefined)).toMatchInlineSnapshot(`"/"`);
      expect(generateProductUrl(undefined, undefined)).toMatchInlineSnapshot(`"/"`);
    });

    it('should not be a match for matcher', () => {
      expect(matchProductRoute(wrap(generateProductUrl(undefined)))).toMatchInlineSnapshot(`undefined`);
    });
  });

  describe('without category', () => {
    describe('without product name', () => {
      const product = createProductView({ sku: 'A' } as Product, categoryTree());
      it('should create simple link when just sku is supplied', () => {
        expect(generateProductUrl(product)).toMatchInlineSnapshot(`"/skuA"`);
      });

      it('should be a match for matcher', () => {
        expect(matchProductRoute(wrap(generateProductUrl(product)))).toMatchInlineSnapshot(`
          Object {
            "sku": "A",
          }
        `);
      });
    });

    describe('with product name', () => {
      const product = createProductView({ sku: 'A', name: 'some example name' } as Product, categoryTree());

      it('should include slug when product has a name', () => {
        expect(generateProductUrl(product)).toMatchInlineSnapshot(`"/some-example-name-skuA"`);
      });

      it('should include filtered slug when product has a name with special characters', () => {
        const product2 = { ...product, name: 'name & speci@l char$' };
        expect(generateProductUrl(product2)).toMatchInlineSnapshot(`"/name-&-speci@l-char$-skuA"`);
      });

      it('should be a match for matcher', () => {
        expect(matchProductRoute(wrap(generateProductUrl(product)))).toMatchInlineSnapshot(`
          Object {
            "sku": "A",
          }
        `);
      });
    });

    describe('variation product', () => {
      const product = createProductView(
        {
          sku: 'A',
          name: 'some example name',
          type: 'VariationProduct',
          variableVariationAttributes: [{ value: 'SSD' }, { value: 'Blue' }],
        } as VariationProduct,
        categoryTree()
      );

      it('should include attribute values in slug when product is a variation', () => {
        expect(generateProductUrl(product)).toMatchInlineSnapshot(`"/some-example-name-SSD-Blue-skuA"`);
      });
    });
  });

  describe('with top level category', () => {
    const categories = categoryTree([specials]);
    const category = createCategoryView(categories, specials.uniqueId);

    describe('as context', () => {
      describe('without product name', () => {
        const product = createProductView({ sku: 'A' } as Product, categories);

        it('should be created', () => {
          expect(generateProductUrl(product, category)).toMatchInlineSnapshot(`"/Spezielles/skuA-catSpecials"`);
        });

        it('should be a match for matcher', () => {
          expect(matchProductRoute(wrap(generateProductUrl(product, category)))).toMatchInlineSnapshot(`
            Object {
              "categoryUniqueId": "Specials",
              "sku": "A",
            }
          `);
        });
      });

      describe('with product name', () => {
        const product = createProductView({ sku: 'A', name: 'Das neue Surface Pro 7' } as Product, categories);

        it('should be created', () => {
          expect(generateProductUrl(product, category)).toMatchInlineSnapshot(
            `"/Spezielles/Das-neue-Surface-Pro-7-skuA-catSpecials"`
          );
        });

        it('should be a match for matcher', () => {
          expect(matchProductRoute(wrap(generateProductUrl(product, category)))).toMatchInlineSnapshot(`
            Object {
              "categoryUniqueId": "Specials",
              "sku": "A",
            }
          `);
        });
      });
    });

    describe('as default category', () => {
      describe('without product name', () => {
        const product = createProductView({ sku: 'A', defaultCategoryId: specials.uniqueId } as Product, categories);

        it('should be created', () => {
          expect(generateProductUrl(product)).toMatchInlineSnapshot(`"/Spezielles/skuA-catSpecials"`);
        });

        it('should be a match for matcher', () => {
          expect(matchProductRoute(wrap(generateProductUrl(product)))).toMatchInlineSnapshot(`
            Object {
              "categoryUniqueId": "Specials",
              "sku": "A",
            }
          `);
        });
      });

      describe('with product name', () => {
        const product = createProductView(
          { sku: 'A', name: 'Das neue Surface Pro 7', defaultCategoryId: specials.uniqueId } as Product,
          categories
        );

        it('should be created', () => {
          expect(generateProductUrl(product)).toMatchInlineSnapshot(
            `"/Spezielles/Das-neue-Surface-Pro-7-skuA-catSpecials"`
          );
        });

        it('should be a match for matcher', () => {
          expect(matchProductRoute(wrap(generateProductUrl(product)))).toMatchInlineSnapshot(`
            Object {
              "categoryUniqueId": "Specials",
              "sku": "A",
            }
          `);
        });
      });
    });
  });

  describe('with deep category', () => {
    const categories = categoryTree([specials, topSeller, limitedOffer]);
    const category = createCategoryView(categories, limitedOffer.uniqueId);

    describe('as context', () => {
      describe('without product name', () => {
        const product = createProductView({ sku: 'A' } as Product, categories);

        it('should be created', () => {
          expect(generateProductUrl(product, category)).toMatchInlineSnapshot(
            `"/Spezielles/Angebote/Black-Friday/skuA-catSpecials.TopSeller.LimitedOffer"`
          );
        });

        it('should be a match for matcher', () => {
          expect(matchProductRoute(wrap(generateProductUrl(product, category)))).toMatchInlineSnapshot(`
            Object {
              "categoryUniqueId": "Specials.TopSeller.LimitedOffer",
              "sku": "A",
            }
          `);
        });
      });

      describe('with product name', () => {
        const product = createProductView({ sku: 'A', name: 'Das neue Surface Pro 7' } as Product, categories);

        it('should be created', () => {
          expect(generateProductUrl(product, category)).toMatchInlineSnapshot(
            `"/Spezielles/Angebote/Black-Friday/Das-neue-Surface-Pro-7-skuA-catSpecials.TopSeller.LimitedOffer"`
          );
        });

        it('should be a match for matcher', () => {
          expect(matchProductRoute(wrap(generateProductUrl(product, category)))).toMatchInlineSnapshot(`
            Object {
              "categoryUniqueId": "Specials.TopSeller.LimitedOffer",
              "sku": "A",
            }
          `);
        });
      });
    });

    describe('as default category', () => {
      describe('without product name', () => {
        const product = createProductView(
          { sku: 'A', defaultCategoryId: limitedOffer.uniqueId } as Product,
          categories
        );

        it('should be created', () => {
          expect(generateProductUrl(product)).toMatchInlineSnapshot(
            `"/Spezielles/Angebote/Black-Friday/skuA-catSpecials.TopSeller.LimitedOffer"`
          );
        });

        it('should be a match for matcher', () => {
          expect(matchProductRoute(wrap(generateProductUrl(product)))).toMatchInlineSnapshot(`
            Object {
              "categoryUniqueId": "Specials.TopSeller.LimitedOffer",
              "sku": "A",
            }
          `);
        });
      });

      describe('with product name', () => {
        const product = createProductView(
          { sku: 'A', name: 'Das neue Surface Pro 7', defaultCategoryId: limitedOffer.uniqueId } as Product,
          categories
        );

        it('should be created', () => {
          expect(generateProductUrl(product)).toMatchInlineSnapshot(
            `"/Spezielles/Angebote/Black-Friday/Das-neue-Surface-Pro-7-skuA-catSpecials.TopSeller.LimitedOffer"`
          );
        });

        it('should be a match for matcher', () => {
          expect(matchProductRoute(wrap(generateProductUrl(product)))).toMatchInlineSnapshot(`
            Object {
              "categoryUniqueId": "Specials.TopSeller.LimitedOffer",
              "sku": "A",
            }
          `);
        });
      });
    });
  });

  describe('compatibility', () => {
    it.each(['/product/123', '/product/123/slug', '/category/123/product/123', '/category/123/product/123/slug'])(
      'should detect %p as route',
      url => {
        expect(matchProductRoute(wrap(url))).toHaveProperty('consumed');
      }
    );

    it('should not detect category route without product after it', () => {
      expect(matchProductRoute(wrap('/category/123'))).toBeUndefined();
    });
  });

  describe('additional URL params', () => {
    it('should ignore additional URL params when supplied', () => {
      const category = createCategoryView(categoryTree([specials, topSeller, limitedOffer]), limitedOffer.uniqueId);
      const product = createProductView({ sku: 'A', name: 'Das neue Surface Pro 7' } as Product, categoryTree());

      expect(matchProductRoute(wrap(generateProductUrl(product, category) + ';lang=de_DE;redirect=1')))
        .toMatchInlineSnapshot(`
        Object {
          "categoryUniqueId": "Specials.TopSeller.LimitedOffer",
          "sku": "A",
        }
      `);
    });
  });

  describe('ofProductRoute', () => {
    it('should detect product route when sku is a param', () => {
      const stream$ = of(new RouteNavigation({ path: 'any', params: { sku: '123' } }));

      expect(stream$.pipe(ofProductRoute())).toBeObservable(
        cold('(a|)', {
          a: new RouteNavigation({
            params: {
              sku: '123',
            },
            path: 'any',
            url: '/any',
          }),
        })
      );
    });

    it('should not detect product route when sku is missing', () => {
      const stream$ = of(new RouteNavigation({ path: 'any' }));

      expect(stream$.pipe(ofProductRoute())).toBeObservable(cold('|'));
    });
  });
});
