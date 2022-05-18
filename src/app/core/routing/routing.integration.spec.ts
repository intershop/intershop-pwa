import { Location } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { selectRouteData, selectRouteParam } from 'ish-core/store/core/router';
import { StoreWithSnapshots, provideStoreSnapshots } from 'ish-core/utils/dev/ngrx-testing';

import { matchCategoryRoute } from './category/category.route';
import { matchProductRoute } from './product/product.route';

describe('Routing Integration', () => {
  let router: Router;
  let location: Location;
  let store: StoreWithSnapshots;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        CoreStoreModule.forTesting(['router']),
        RouterTestingModule.withRoutes([
          { matcher: matchProductRoute, data: { page: 'product' }, children: [{ path: '**', children: [] }] },
          { matcher: matchCategoryRoute, data: { page: 'category' }, children: [{ path: '**', children: [] }] },
          { path: '**', children: [], data: { page: 'error' } },
        ]),
      ],
      providers: [provideStoreSnapshots()],
    });

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    store = TestBed.inject(StoreWithSnapshots);
  });

  describe('navigating to an unknown page', () => {
    it('should land at the error page', async () => {
      await router.navigateByUrl('/some');

      expect(location.path()).toEqual('/some');

      expect(selectRouteData('page')(store.state)).toEqual('error');
    });
  });

  describe('navigating to a product page', () => {
    it('should land at the product page for simple syntax with sku only', async () => {
      await router.navigateByUrl('/prd12345');

      expect(location.path()).toEqual('/prd12345');

      expect(selectRouteData('page')(store.state)).toEqual('product');
      expect(selectRouteParam('sku')(store.state)).toEqual('12345');
      expect(selectRouteParam('categoryUniqueId')(store.state)).toBeUndefined();
    });

    it('should land at the product page for syntax with sku and slug', async () => {
      await router.navigateByUrl('/my-fancy-product-prd12345');

      expect(location.path()).toEqual('/my-fancy-product-prd12345');

      expect(selectRouteData('page')(store.state)).toEqual('product');
      expect(selectRouteParam('sku')(store.state)).toEqual('12345');
      expect(selectRouteParam('categoryUniqueId')(store.state)).toBeUndefined();
    });

    it('should land at the product page for simple syntax with sku and categoryUniqueId only', async () => {
      await router.navigateByUrl('/prd12345-ctgCAT');

      expect(location.path()).toEqual('/prd12345-ctgCAT');

      expect(selectRouteData('page')(store.state)).toEqual('product');
      expect(selectRouteParam('sku')(store.state)).toEqual('12345');
      expect(selectRouteParam('categoryUniqueId')(store.state)).toEqual('CAT');
    });

    it('should land at the product page for syntax with slug, sku and categoryUniqueId', async () => {
      await router.navigateByUrl('/fancy-category/fancy-product-prd12345-ctgCAT');

      expect(location.path()).toEqual('/fancy-category/fancy-product-prd12345-ctgCAT');

      expect(selectRouteData('page')(store.state)).toEqual('product');
      expect(selectRouteParam('sku')(store.state)).toEqual('12345');
      expect(selectRouteParam('categoryUniqueId')(store.state)).toEqual('CAT');
    });
  });

  describe('navigating to a category page', () => {
    it('should land at the category page for simple syntax with categoryUniqueId only', async () => {
      await router.navigateByUrl('/ctgCAT');

      expect(location.path()).toEqual('/ctgCAT');

      expect(selectRouteData('page')(store.state)).toEqual('category');
      expect(selectRouteParam('sku')(store.state)).toBeUndefined();
      expect(selectRouteParam('categoryUniqueId')(store.state)).toEqual('CAT');
    });

    it('should land at the category page for syntax with slug and categoryUniqueId', async () => {
      await router.navigateByUrl('/fancy-category-ctgCAT');

      expect(location.path()).toEqual('/fancy-category-ctgCAT');

      expect(selectRouteData('page')(store.state)).toEqual('category');
      expect(selectRouteParam('sku')(store.state)).toBeUndefined();
      expect(selectRouteParam('categoryUniqueId')(store.state)).toEqual('CAT');
    });
  });

  describe('special case with tokens in URL', () => {
    it('should navigate to the correct product page when sku contains "sku"', async () => {
      await router.navigateByUrl('/acer/glaskugel-prdglaskugel_1-ctgHome');

      expect(location.path()).toEqual('/acer/glaskugel-prdglaskugel_1-ctgHome');

      expect(selectRouteData('page')(store.state)).toEqual('product');
      expect(selectRouteParam('sku')(store.state)).toEqual('glaskugel_1');
      expect(selectRouteParam('categoryUniqueId')(store.state)).toEqual('Home');
    });

    it('should navigate to the correct product page when category contains "cat"', async () => {
      await router.navigateByUrl('/furniture/cat-tree-prdtree_1-ctgtrees-for-cats');

      expect(location.path()).toEqual('/furniture/cat-tree-prdtree_1-ctgtrees-for-cats');

      expect(selectRouteData('page')(store.state)).toEqual('product');
      expect(selectRouteParam('sku')(store.state)).toEqual('tree_1');
      expect(selectRouteParam('categoryUniqueId')(store.state)).toEqual('trees-for-cats');
    });

    it('should navigate to the correct product page when sku contains "cat"', async () => {
      await router.navigateByUrl('/furniture/cat-tree-prdcat-tree_1-ctgtrees-for-cats');

      expect(location.path()).toEqual('/furniture/cat-tree-prdcat-tree_1-ctgtrees-for-cats');

      expect(selectRouteData('page')(store.state)).toEqual('product');
      expect(selectRouteParam('sku')(store.state)).toEqual('cat-tree_1');
      expect(selectRouteParam('categoryUniqueId')(store.state)).toEqual('trees-for-cats');
    });

    it('should navigate to the correct product page when sku contains "cat" with simple route', async () => {
      await router.navigateByUrl('/prdcat-tree_1-ctgtrees-for-cats');

      expect(location.path()).toEqual('/prdcat-tree_1-ctgtrees-for-cats');

      expect(selectRouteData('page')(store.state)).toEqual('product');
      expect(selectRouteParam('sku')(store.state)).toEqual('cat-tree_1');
      expect(selectRouteParam('categoryUniqueId')(store.state)).toEqual('trees-for-cats');
    });

    it('should navigate to the correct product page when sku contains "cat" with simple route by sku only', async () => {
      await router.navigateByUrl('/prdcat-tree_1');

      expect(location.path()).toEqual('/prdcat-tree_1');

      expect(selectRouteData('page')(store.state)).toEqual('product');
      expect(selectRouteParam('sku')(store.state)).toEqual('cat-tree_1');
      expect(selectRouteParam('categoryUniqueId')(store.state)).toBeUndefined();
    });

    it('should navigate to the correct category page when uniqueId contains "-sku"', async () => {
      await router.navigateByUrl('/cult-equipment-ctgcrosses-and-skulls');

      expect(location.path()).toEqual('/cult-equipment-ctgcrosses-and-skulls');

      expect(selectRouteData('page')(store.state)).toEqual('category');
      expect(selectRouteParam('sku')(store.state)).toBeUndefined();
      expect(selectRouteParam('categoryUniqueId')(store.state)).toEqual('crosses-and-skulls');
    });

    it('should navigate to the correct category page when uniqueId contains "-sku" with simple route', async () => {
      await router.navigateByUrl('/ctgcrosses-and-skulls');

      expect(location.path()).toEqual('/ctgcrosses-and-skulls');

      expect(selectRouteData('page')(store.state)).toEqual('category');
      expect(selectRouteParam('sku')(store.state)).toBeUndefined();
      expect(selectRouteParam('categoryUniqueId')(store.state)).toEqual('crosses-and-skulls');
    });
  });
});
