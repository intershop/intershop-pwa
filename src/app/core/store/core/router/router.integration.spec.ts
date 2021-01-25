import { Component } from '@angular/core';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Store, select } from '@ngrx/store';

import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { StoreWithSnapshots, provideStoreSnapshots } from 'ish-core/utils/dev/ngrx-testing';

import { ofUrl } from './router.operators';
import {
  selectPath,
  selectQueryParam,
  selectQueryParams,
  selectRouteData,
  selectRouteParam,
  selectRouter,
  selectUrl,
} from './router.selectors';

describe('Router Integration', () => {
  let router: Router;

  beforeEach(() => {
    @Component({ template: 'dummy' })
    class DummyComponent {}

    TestBed.configureTestingModule({
      declarations: [DummyComponent],
      imports: [
        CoreStoreModule.forTesting(['router'], true),
        RouterTestingModule.withRoutes([
          {
            path: 'test',
            data: { level: 1, root: true },
            children: [
              {
                path: ':foo',
                data: { foo: 'data' },
                children: [
                  {
                    path: 'deep',
                    data: { leaf: true },
                    children: [
                      {
                        path: 'routes',
                        component: DummyComponent,
                        data: { level: 4 },
                      },
                    ],
                  },
                ],
              },
            ],
          },
          { path: '**', component: DummyComponent },
        ]),
      ],
      providers: [provideStoreSnapshots()],
    });

    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(router).toBeTruthy();
  });

  describe('selectors', () => {
    let store$: StoreWithSnapshots;
    beforeEach(() => {
      store$ = TestBed.inject(StoreWithSnapshots);
    });

    it('should be undefined on start', () => {
      expect(selectRouter(store$.state)).toBeUndefined();
      expect(selectQueryParams(store$.state)).toBeEmpty();
      expect(selectQueryParam('foo')(store$.state)).toBeUndefined();
      expect(selectRouteData('foo')(store$.state)).toBeUndefined();
      expect(selectRouteParam('foo')(store$.state)).toBeUndefined();
      expect(selectUrl(store$.state)).toBeUndefined();
      expect(selectPath(store$.state)).toBeUndefined();
      expect(store$.actionsArray()).toMatchInlineSnapshot(`Array []`);
    });

    it('should be empty on initial navigation', fakeAsync(() => {
      router.initialNavigation();
      tick(500);

      expect(selectRouter(store$.state)).toMatchInlineSnapshot(`
        Object {
          "navigationId": 1,
          "state": Object {
            "data": Object {},
            "params": Object {},
            "path": "**",
            "queryParams": Object {},
            "url": "/",
          },
        }
      `);
      expect(selectQueryParams(store$.state)).toBeEmpty();
      expect(selectQueryParam('foo')(store$.state)).toBeUndefined();
      expect(selectRouteData('foo')(store$.state)).toBeUndefined();
      expect(selectRouteParam('foo')(store$.state)).toBeUndefined();
      expect(selectUrl(store$.state)).toMatchInlineSnapshot(`"/"`);
      expect(selectPath(store$.state)).toMatchInlineSnapshot(`"**"`);
      expect(store$.actionsArray()).toMatchInlineSnapshot(`
        @ngrx/router-store/request:
          routerState: {"url":"","params":{},"queryParams":{},"data":{}}
          event: {"id":1,"url":"/"}
        @ngrx/router-store/navigation:
          routerState: {"url":"/","params":{},"queryParams":{},"data":{},"path":"**"}
          event: {"id":1,"url":"/","urlAfterRedirects":"/"}
        @ngrx/router-store/navigated:
          routerState: {"url":"/","params":{},"queryParams":{},"data":{},"path":"**"}
          event: {"id":1,"url":"/","urlAfterRedirects":"/"}
      `);
    }));

    it('should collect data when triggered with simple route', fakeAsync(() => {
      router.navigateByUrl('/any;foo=urlParam;bar=bar?bar=bar&foo=queryParam');
      tick(500);

      expect(selectRouter(store$.state)).toMatchInlineSnapshot(`
        Object {
          "navigationId": 1,
          "state": Object {
            "data": Object {},
            "params": Object {
              "bar": "bar",
              "foo": "urlParam",
            },
            "path": "**",
            "queryParams": Object {
              "bar": "bar",
              "foo": "queryParam",
            },
            "url": "/any;foo=urlParam;bar=bar?bar=bar&foo=queryParam",
          },
        }
      `);
      expect(selectQueryParams(store$.state)).toMatchInlineSnapshot(`
        Object {
          "bar": "bar",
          "foo": "queryParam",
        }
      `);
      expect(selectQueryParam('foo')(store$.state)).toMatchInlineSnapshot(`"queryParam"`);
      expect(selectRouteData('foo')(store$.state)).toBeUndefined();
      expect(selectRouteParam('foo')(store$.state)).toMatchInlineSnapshot(`"urlParam"`);
      expect(selectUrl(store$.state)).toMatchInlineSnapshot(`"/any;foo=urlParam;bar=bar?bar=bar&foo=queryParam"`);
      expect(selectPath(store$.state)).toMatchInlineSnapshot(`"**"`);
      expect(store$.actionsArray()).toMatchInlineSnapshot(`
        @ngrx/router-store/request:
          routerState: {"url":"","params":{},"queryParams":{},"data":{}}
          event: {"id":1,"url":"/any;foo=urlParam;bar=bar?bar=bar&foo=queryPa...
        @ngrx/router-store/navigation:
          routerState: {"url":"/any;foo=urlParam;bar=bar?bar=bar&foo=queryParam","p...
          event: {"id":1,"url":"/any;foo=urlParam;bar=bar?bar=bar&foo=queryPa...
        @ngrx/router-store/navigated:
          routerState: {"url":"/any;foo=urlParam;bar=bar?bar=bar&foo=queryParam","p...
          event: {"id":1,"url":"/any;foo=urlParam;bar=bar?bar=bar&foo=queryPa...
      `);
    }));

    it('should collect data when triggered with deep route', fakeAsync(() => {
      router.navigateByUrl('/test/very/deep/routes;bar=bar?bar=bar&foo=queryParam');
      tick(500);

      expect(selectRouter(store$.state)).toMatchInlineSnapshot(`
        Object {
          "navigationId": 1,
          "state": Object {
            "data": Object {
              "foo": "data",
              "leaf": true,
              "level": 4,
              "root": true,
            },
            "params": Object {
              "bar": "bar",
              "foo": "very",
            },
            "path": "test/:foo/deep/routes",
            "queryParams": Object {
              "bar": "bar",
              "foo": "queryParam",
            },
            "url": "/test/very/deep/routes;bar=bar?bar=bar&foo=queryParam",
          },
        }
      `);
      expect(selectQueryParams(store$.state)).toMatchInlineSnapshot(`
        Object {
          "bar": "bar",
          "foo": "queryParam",
        }
      `);
      expect(selectQueryParam('foo')(store$.state)).toMatchInlineSnapshot(`"queryParam"`);
      expect(selectRouteData('foo')(store$.state)).toMatchInlineSnapshot(`"data"`);
      expect(selectRouteData('level')(store$.state)).toMatchInlineSnapshot(`4`);
      expect(selectRouteData('leaf')(store$.state)).toMatchInlineSnapshot(`true`);
      expect(selectRouteData('root')(store$.state)).toMatchInlineSnapshot(`true`);
      expect(selectRouteParam('foo')(store$.state)).toMatchInlineSnapshot(`"very"`);
      expect(selectUrl(store$.state)).toMatchInlineSnapshot(`"/test/very/deep/routes;bar=bar?bar=bar&foo=queryParam"`);
      expect(selectPath(store$.state)).toMatchInlineSnapshot(`"test/:foo/deep/routes"`);
      expect(store$.actionsArray()).toMatchInlineSnapshot(`
        @ngrx/router-store/request:
          routerState: {"url":"","params":{},"queryParams":{},"data":{}}
          event: {"id":1,"url":"/test/very/deep/routes;bar=bar?bar=bar&foo=qu...
        @ngrx/router-store/navigation:
          routerState: {"url":"/test/very/deep/routes;bar=bar?bar=bar&foo=queryPara...
          event: {"id":1,"url":"/test/very/deep/routes;bar=bar?bar=bar&foo=qu...
        @ngrx/router-store/navigated:
          routerState: {"url":"/test/very/deep/routes;bar=bar?bar=bar&foo=queryPara...
          event: {"id":1,"url":"/test/very/deep/routes;bar=bar?bar=bar&foo=qu...
      `);
    }));
  });

  describe('ofUrl operator', () => {
    let store$: Store;

    beforeEach(() => {
      store$ = TestBed.inject(Store);
    });

    beforeEach(fakeAsync(() => {
      router.navigateByUrl('/any?view=list');
    }));

    it('should pass through any matcher when used', done => {
      store$.pipe(ofUrl(/.*/), select(selectUrl)).subscribe(url => {
        expect(url).toMatchInlineSnapshot(`"/any?view=list"`);
        done();
      });
    });

    it('should pass through specific matcher when used', done => {
      store$.pipe(ofUrl(/view/), select(selectUrl)).subscribe(url => {
        expect(url).toMatchInlineSnapshot(`"/any?view=list"`);
        done();
      });
    });

    it('should not pass through exact matcher when used', fakeAsync(() => {
      store$.pipe(ofUrl(/^\/any$/), select(selectUrl)).subscribe(fail, fail, fail);

      tick(2000);
    }));
  });
});
