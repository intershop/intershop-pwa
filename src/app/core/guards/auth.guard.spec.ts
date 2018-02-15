import { async, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ROUTER_NAVIGATION, RouterNavigationAction } from '@ngrx/router-store';
import { Store, StoreModule } from '@ngrx/store';
import { Customer } from '../../models/customer/customer.model';
import { reducers } from '../store/core.system';
import { LoginUserSuccess, State } from '../store/user';
import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {

  describe('canActivate()', () => {
    let authGuard: AuthGuard;
    let store: Store<State>;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [
          RouterTestingModule,
          StoreModule.forRoot(reducers)
        ],
        providers: [AuthGuard]
      }).compileComponents();
    }));

    beforeEach(() => {
      authGuard = TestBed.get(AuthGuard);
      store = TestBed.get(Store);
      store.dispatch({
        payload: {
          routerState: { url: '/any' },
          event: { id: 1 }
        },
        type: ROUTER_NAVIGATION
      } as RouterNavigationAction);
    });

    it('should return true when user is authorized', () => {
      store.dispatch(new LoginUserSuccess({} as Customer));

      authGuard.canActivate().subscribe(authorized =>
        expect(authorized).toBeTruthy()
      );
    });

    it('should return false when called as unauthorized', () => {
      authGuard.canActivate().subscribe(authorized =>
        expect(authorized).toBeFalsy()
      );
    });
  });
});
