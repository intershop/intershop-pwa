import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { ConfigurationGuard } from './configuration.guard';

describe('Configuration Guard', () => {
  let location: Location;
  let router: Router;

  @Component({ template: 'dummy' })
  class DummyComponent {}

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DummyComponent],
      imports: [
        RouterTestingModule.withRoutes([{ path: '**', canActivate: [ConfigurationGuard], component: DummyComponent }]),
      ],
    });

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
  });

  it('should pass through normal routes when activated', fakeAsync(() => {
    router.navigateByUrl('/any');
    tick(500);

    expect(location.path()).toMatchInlineSnapshot(`"/any"`);
  }));

  it('should pass through deep routes when activated', fakeAsync(() => {
    router.navigateByUrl('/any/foo/bar;foo=bar?param=test');
    tick(500);

    expect(location.path()).toMatchInlineSnapshot(`"/any/foo/bar;foo=bar?param=test"`);
  }));

  it('should filter out url params in normal routes when activated', fakeAsync(() => {
    router.navigateByUrl('/any;foo=bar;redirect=1');
    tick(500);

    expect(location.path()).toMatchInlineSnapshot(`"/any"`);
  }));

  it('should filter out url params in deep routes when activated', fakeAsync(() => {
    router.navigateByUrl('/any/foo/bar;foo=bar;redirect=1?param=test');
    tick(500);

    expect(location.path()).toMatchInlineSnapshot(`"/any/foo/bar?param=test"`);
  }));
});
