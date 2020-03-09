import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { RouterEffects } from './effects';

describe('Effects', () => {
  let effects: RouterEffects;
  let router: Router;

  beforeEach(() => {
    @Component({ template: 'dummy' })
    class DummyComponent {}

    const matcher = () => ({ consumed: [] });

    TestBed.configureTestingModule({
      declarations: [DummyComponent],
      imports: [
        RouterTestingModule.withRoutes([
          { path: '', redirectTo: 'home', pathMatch: 'full' },
          { path: 'home', component: DummyComponent },
          { path: 'product/:sku', component: DummyComponent },
          { path: 'data', component: DummyComponent, data: { foo: 'bar' } },
          { matcher, children: [{ path: '**', component: DummyComponent }] },
        ]),
      ],
      providers: [RouterEffects],
    });

    effects = TestBed.get(RouterEffects);
    router = TestBed.get(Router);
  });

  it('should fire for root routes', done => {
    effects.listenToRouter$.subscribe(action => {
      expect(action).toMatchInlineSnapshot(`
        [Router] Navigation:
          params: {}
          queryParams: {}
          data: {}
          url: "/home"
          path: "home"
      `);
      done();
    });

    router.navigateByUrl('/');
  });

  it('should fire for simple routes', done => {
    effects.listenToRouter$.subscribe(action => {
      expect(action).toMatchInlineSnapshot(`
        [Router] Navigation:
          params: {}
          queryParams: {}
          data: {}
          url: "/home"
          path: "home"
      `);
      done();
    });

    router.navigateByUrl('/home');
  });

  it('should parse query params for routes', done => {
    effects.listenToRouter$.subscribe(action => {
      expect(action).toMatchInlineSnapshot(`
        [Router] Navigation:
          params: {}
          queryParams: {"foo":"bar","dummy":"test"}
          data: {}
          url: "/home"
          path: "home"
      `);
      done();
    });

    router.navigateByUrl('/home?foo=bar&dummy=test');
  });

  it('should parse params for routes', done => {
    effects.listenToRouter$.subscribe(action => {
      expect(action).toMatchInlineSnapshot(`
        [Router] Navigation:
          params: {"sku":"1234"}
          queryParams: {}
          data: {}
          url: "/product/1234"
          path: "product/:sku"
      `);
      done();
    });

    router.navigateByUrl('/product/1234');
  });

  it('should parse data for routes', done => {
    effects.listenToRouter$.subscribe(action => {
      expect(action).toMatchInlineSnapshot(`
        [Router] Navigation:
          params: {}
          queryParams: {}
          data: {"foo":"bar"}
          url: "/data"
          path: "data"
      `);
      done();
    });

    router.navigateByUrl('/data');
  });

  it('should ignore URL params for url on routes', done => {
    effects.listenToRouter$.subscribe(action => {
      expect(action).toMatchInlineSnapshot(`
        [Router] Navigation:
          params: {"lang":"de_DE"}
          queryParams: {}
          data: {}
          url: "/any/123"
          path: "**"
      `);
      done();
    });

    router.navigateByUrl('/any/123;lang=de_DE');
  });

  it('should handle both URL params and query params for url on routes', done => {
    effects.listenToRouter$.subscribe(action => {
      expect(action).toMatchInlineSnapshot(`
        [Router] Navigation:
          params: {"sku":"123","lang":"de_DE","channel":"c1"}
          queryParams: {"view":"grid","page":"2"}
          data: {}
          url: "/product/123"
          path: "product/:sku"
      `);
      done();
    });

    router.navigateByUrl('/product/123;lang=de_DE;channel=c1?view=grid&page=2');
  });
});
