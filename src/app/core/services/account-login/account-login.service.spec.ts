import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { anything, instance, mock, verify, when } from 'ts-mockito';
import { Customer } from '../../../models/customer.model';
import { ApiService } from '../api.service';
import { AccountLoginService } from './account-login.service';
import { UserDetailService } from './user-detail.service';

describe('AccountLogin Service', () => {
  const userData = {
    'firstName': 'Patricia',
    'lastName': 'Miller'
  };

  let accountLoginService: AccountLoginService;
  const userDetailService = mock(UserDetailService);
  const apiServiceMock = mock(ApiService);

  beforeEach(() => {
    when(userDetailService.getValue()).thenReturn(userData as Customer);
    accountLoginService = new AccountLoginService(instance(userDetailService), instance(apiServiceMock));
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
    verify(userDetailService.setUserDetail(null)).called();
  });

  it('should return error message when wrong credentials are entered', () => {
    const errorMessage = '401 and Unauthorized';
    const userDetails = { userName: 'intershop@123.com', password: 'wrong' };
    when(apiServiceMock.get(anything(), anything(), anything())).thenReturn(ErrorObservable.create(new Error(errorMessage)));
    accountLoginService.singinUser(userDetails).subscribe((data) => {
      expect(data).toBe(null);
    }, (error) => {
      expect(error).toBeTruthy();
      expect(error.message).toBe(errorMessage);
    });
  });

  it('should return false when user is unauthorized', () => {
    when(userDetailService.getValue()).thenReturn(null);
    const result = accountLoginService.isAuthorized();
    expect(result).toBe(false);
  });

  it('should return true when user is authorized', () => {
    const authorized = accountLoginService.isAuthorized();
    expect(authorized).toBe(true);
  });
});
