import { Component } from '@angular/core';
import { TestBed, async } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Store } from '@ngrx/store';

import { Customer } from 'ish-core/models/customer/customer.model';
import { coreReducers } from 'ish-core/store/core-store.module';
import { LoginUserSuccess } from 'ish-core/store/user';
import { ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';

import { AuthGuard } from './auth.guard';

describe('Auth Guard', () => {
  describe('canActivate()', () => {
    let authGuard: AuthGuard;
    let store$: Store<{}>;

    beforeEach(async(() => {
      @Component({ template: 'dummy' })
      class DummyComponent {}

      TestBed.configureTestingModule({
        imports: [
          RouterTestingModule.withRoutes([{ path: 'login', component: DummyComponent }]),
          ngrxTesting({ reducers: coreReducers }),
        ],
        declarations: [DummyComponent],
      }).compileComponents();
    }));

    beforeEach(() => {
      authGuard = TestBed.get(AuthGuard);
      store$ = TestBed.get(Store);
    });

    it('should return true when user is authorized', done => {
      store$.dispatch(new LoginUserSuccess({ customer: {} as Customer }));

      authGuard
        .canActivate({} as ActivatedRouteSnapshot, { url: 'home' } as RouterStateSnapshot)
        .subscribe(authorized => {
          expect(authorized).toBeTruthy();
          done();
        });
    });

    it('should return false when called as unauthorized', done => {
      authGuard
        .canActivate({} as ActivatedRouteSnapshot, { url: 'home' } as RouterStateSnapshot)
        .subscribe(authorized => {
          expect(authorized).toBeInstanceOf(UrlTree);
          expect((authorized as UrlTree).queryParams).toHaveProperty('returnUrl', 'home');
          done();
        });
    });
  });
});
