import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { CoreStoreModule } from 'ish-core/store/core-store.module';
import { UserActionTypes } from 'ish-core/store/user';
import { StoreWithSnapshots, containsActionWithType, provideStoreSnapshots } from 'ish-core/utils/dev/ngrx-testing';

import { LogoutGuard } from './logout.guard';

describe('Logout Guard', () => {
  let store$: StoreWithSnapshots;
  let router: Router;
  let location: Location;

  beforeEach(() => {
    @Component({ template: 'dummy' })
    class DummyComponent {}

    TestBed.configureTestingModule({
      declarations: [DummyComponent],
      imports: [
        CoreStoreModule.forTesting(['router'], true),
        RouterTestingModule.withRoutes([
          { path: 'home', component: DummyComponent },
          { path: 'foo', component: DummyComponent },
          { path: '**', component: DummyComponent, canActivate: [LogoutGuard] },
        ]),
      ],
      providers: [provideStoreSnapshots()],
    }).compileComponents();

    store$ = TestBed.inject(StoreWithSnapshots);
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
  });

  it('should log out when called', fakeAsync(() => {
    router.navigateByUrl('/any');
    tick(500);

    expect(store$.actionsArray()).toSatisfy(containsActionWithType(UserActionTypes.LogoutUser));
  }));

  it('should redirect to /home when called', fakeAsync(() => {
    router.navigateByUrl('/any');
    tick(500);

    expect(location.path()).toMatchInlineSnapshot(`"/home"`);
  }));

  it('should redirect to returnUrl when supplied', fakeAsync(() => {
    router.navigateByUrl('/any?returnUrl=/foo');
    tick(500);

    expect(location.path()).toMatchInlineSnapshot(`"/foo"`);
  }));
});
