import { TestBed, async } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Store, StoreModule } from '@ngrx/store';

import { MockComponent } from 'ish-core/utils/dev/mock.component';
import { Customer } from '../models/customer/customer.model';
import { coreReducers } from '../store/core-store.module';
import { LoginUserSuccess } from '../store/user';

import { AuthGuard } from './auth.guard';

describe('Auth Guard', () => {
  describe('canActivate()', () => {
    let authGuard: AuthGuard;
    let store$: Store<{}>;

    beforeEach(async(() => {
      const loginComponentMock = MockComponent({ selector: 'ish-login', template: 'Login Component' });

      TestBed.configureTestingModule({
        imports: [
          RouterTestingModule.withRoutes([{ path: 'login', component: loginComponentMock }]),
          StoreModule.forRoot(coreReducers),
        ],
        declarations: [loginComponentMock],
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
