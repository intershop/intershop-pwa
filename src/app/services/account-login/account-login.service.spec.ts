import { Observable } from 'rxjs/Rx';
import { anything, instance, mock, verify, when } from 'ts-mockito';
import { ApiService } from '../api.service';
import { JwtService } from '../jwt.service';
import { UserDetail } from './account-login.model';
import { AccountLoginService } from './account-login.service';
import { UserDetailService } from './user-detail.service';

describe('AccountLogin Service', () => {
  const userData = {
    'firstName': 'Patricia',
    'lastName': 'Miller'
  };

  let accountLoginService: AccountLoginService;
  const jwtServiceMock = mock(JwtService);
  const userDetailService = mock(UserDetailService);
  const apiServiceMock = mock(ApiService);

  beforeEach(() => {
    when(userDetailService.current).thenReturn(userData as UserDetail);
    accountLoginService = new AccountLoginService(instance(jwtServiceMock), instance(userDetailService), instance(apiServiceMock));
  });

  it('should login the user when correct credentials are entered', () => {
    const loginDetail = { userName: 'patricia@test.intershop.de', password: '!InterShop00!' };
    when(apiServiceMock.get(anything(), anything(), anything())).thenReturn(Observable.of({ authorized: true }));
    let loggedInDetail;
    accountLoginService.singinUser(loginDetail).subscribe(data => {
      loggedInDetail = data;
    });

    verify(userDetailService.setUserDetail(anything())).called();
    expect(loggedInDetail).not.toBe({ authorized: true });
  });

  it('should destroy token when user logs out', () => {
    accountLoginService.logout();
    verify(jwtServiceMock.destroyToken()).called();
  });

  it('should return error message when wrong credentials are entered', () => {
    const userDetails = { userName: 'intershop@123.com', password: 'wrong' };
    when(apiServiceMock.get(anything(), anything(), anything())).thenReturn(Observable.of('401 and Unauthorized'));
    accountLoginService.singinUser(userDetails).subscribe((data) => {
      expect(data).toBe('401 and Unauthorized');
    });
  });

  it('should return false when user is unauthorized', () => {
    when(jwtServiceMock.getToken()).thenReturn('');
    const result = accountLoginService.isAuthorized();
    expect(result).toBe(false);
  });

  it('should return true when user is authorized', () => {
    when(jwtServiceMock.getToken()).thenReturn('Authorised');
    const authorized = accountLoginService.isAuthorized();
    expect(authorized).toBe(true);
  });
});
