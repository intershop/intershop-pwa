import { Component } from '@angular/core';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { AuthorizationToggleModule } from 'ish-core/authorization-toggle.module';

import { AuthorizationToggleGuard } from './authorization-toggle.guard';

describe('Authorization Toggle Guard', () => {
  let router: Router;

  beforeEach(() => {
    @Component({ template: 'dummy' })
    class DummyComponent {}

    TestBed.configureTestingModule({
      declarations: [DummyComponent],
      imports: [
        AuthorizationToggleModule.forTesting('DO_THIS'),
        RouterTestingModule.withRoutes([
          {
            path: 'error',
            component: DummyComponent,
          },
          {
            path: 'page1',
            component: DummyComponent,
            canActivate: [AuthorizationToggleGuard],
            data: { permission: 'DO_THIS' },
          },
          {
            path: 'page2',
            component: DummyComponent,
            canActivate: [AuthorizationToggleGuard],
            data: { permission: 'DO_THAT' },
          },
        ]),
      ],
    });

    router = TestBed.inject(Router);
  });

  it('should navigate successfully if user has permission', fakeAsync(() => {
    router.navigate(['/page1']);
    tick(2000);

    expect(router.url).toMatchInlineSnapshot(`"/page1"`);
  }));

  it('should not navigate if user is not authorized', fakeAsync(() => {
    router.navigate(['/page2']);
    tick(2000);

    expect(router.url).toMatchInlineSnapshot(`"/error?error=missing-permission&value=DO_THAT"`);
  }));
});
