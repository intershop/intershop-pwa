import { async, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Store, StoreModule } from '@ngrx/store';
import { Customer } from '../../models/customer/customer.model';
import { MockComponent } from '../../utils/dev/mock.component';
import { navigateMockAction } from '../../utils/dev/navigate-mock.action';
import { CoreState } from '../store/core.state';
import { coreReducers } from '../store/core.system';
import { LoginUserSuccess } from '../store/user';
import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {

  describe('canActivate()', () => {
    let authGuard: AuthGuard;
    let store: Store<CoreState>;

    beforeEach(async(() => {
      const loginComponentMock = MockComponent({ selector: 'ish-login', template: 'Login Component' });

      TestBed.configureTestingModule({
        imports: [
          RouterTestingModule.withRoutes([
            { path: 'login', component: loginComponentMock }
          ]),
          StoreModule.forRoot(coreReducers)
        ],
        providers: [AuthGuard],
        declarations: [loginComponentMock]
      }).compileComponents();
    }));

    beforeEach(() => {
      authGuard = TestBed.get(AuthGuard);
      store = TestBed.get(Store);
      store.dispatch(navigateMockAction({ url: '/any' }));
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
