import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Store } from '@ngrx/store';
import { instance, mock } from 'ts-mockito';

import { Customer } from 'ish-core/models/customer/customer.model';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { CustomerStoreModule } from 'ish-core/store/customer/customer-store.module';
import { loginUserSuccess } from 'ish-core/store/customer/user';
import { CookiesService } from 'ish-core/utils/cookies/cookies.service';

import { AuthGuard } from './auth.guard';

describe('Auth Guard', () => {
  describe('canActivate()', () => {
    let authGuard: AuthGuard;
    let store$: Store;

    beforeEach(async () => {
      @Component({ template: 'dummy' })
      class DummyComponent {}

      await TestBed.configureTestingModule({
        imports: [
          CoreStoreModule.forTesting(),
          CustomerStoreModule.forTesting('user'),
          RouterTestingModule.withRoutes([{ path: 'login', component: DummyComponent }]),
        ],
        declarations: [DummyComponent],
        providers: [{ provide: CookiesService, useFactory: () => instance(mock(CookiesService)) }],
      }).compileComponents();
    });

    beforeEach(() => {
      authGuard = TestBed.inject(AuthGuard);
      store$ = TestBed.inject(Store);
    });

    it('should return true when user is authorized', done => {
      store$.dispatch(loginUserSuccess({ customer: {} as Customer }));

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
