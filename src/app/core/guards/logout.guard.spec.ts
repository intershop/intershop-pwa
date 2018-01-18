import { async, TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { instance, mock, verify } from 'ts-mockito/lib/ts-mockito';
import { AccountLoginService } from '../services/account-login/account-login.service';
import { LogoutGuard } from './logout.guard';

describe('LogoutGuard', () => {

  describe('canActivate()', () => {
    let logoutGuard: LogoutGuard;
    const accountLoginServiceMock = mock(AccountLoginService);

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [
          RouterTestingModule
        ],
        providers: [LogoutGuard,
          { provide: AccountLoginService, useFactory: () => instance(accountLoginServiceMock) }
        ]

      }).compileComponents();
    }));

    beforeEach(() => {
      logoutGuard = TestBed.get(LogoutGuard);
    });

    it('should log out when called', () => {
      const snapshot = { url: [{ path: '' }] } as ActivatedRouteSnapshot;
      logoutGuard.canActivate(snapshot, null);
      verify(accountLoginServiceMock.logout()).called();
    });

  });
});
