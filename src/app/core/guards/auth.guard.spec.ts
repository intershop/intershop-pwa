import { async, TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot } from '@angular/router';
import { RouterStateSnapshot } from '@angular/router/src/router_state';
import { RouterTestingModule } from '@angular/router/testing';
import { instance, mock, when } from 'ts-mockito/lib/ts-mockito';
import { AccountLoginService } from '../services/account-login/account-login.service';
import { AuthGuard } from './auth.guard';

xdescribe('AuthGuard', () => {

  describe('canActivate()', () => {
    let authGuard: AuthGuard;
    let accountLoginService: AccountLoginService;
    const accountLoginServiceMock = mock(AccountLoginService);

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [
          RouterTestingModule
        ],
        providers: [AuthGuard,
          { provide: AccountLoginService, useFactory: () => instance(accountLoginServiceMock) }
        ]
      }).compileComponents();
    }));

    beforeEach(() => {
      authGuard = TestBed.get(AuthGuard);
      accountLoginService = TestBed.get(AccountLoginService);
    });

    it('should return true when called as authorized', () => {
      const snapshot = { url: [{ path: 'a' }] } as ActivatedRouteSnapshot;
      const routerStateSnapshot = { url: 'b' } as RouterStateSnapshot;
      when(accountLoginServiceMock.isAuthorized()).thenReturn(true);
      expect(authGuard.canActivate(snapshot, routerStateSnapshot)).toBeTruthy();
    });

    it('should return false when called as unauthorized', () => {
      const snapshot = { url: [{ path: 'a' }] } as ActivatedRouteSnapshot;
      const routerStateSnapshot = { url: 'b' } as RouterStateSnapshot;
      when(accountLoginServiceMock.isAuthorized()).thenReturn(false);
      expect(authGuard.canActivate(snapshot, routerStateSnapshot)).toBeFalsy();
    });

  });
});
