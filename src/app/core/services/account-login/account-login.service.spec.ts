import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { of } from 'rxjs/observable/of';
import { anything, instance, mock, when } from 'ts-mockito';
import { ApiService } from '../api.service';
import { AccountLoginService } from './account-login.service';

describe('AccountLogin Service', () => {
  let accountLoginService: AccountLoginService;
  const apiServiceMock = mock(ApiService);

  beforeEach(() => {
    accountLoginService = new AccountLoginService(instance(apiServiceMock));
  });

  it('should login the user when correct credentials are entered', () => {
    const loginDetail = { userName: 'patricia@test.intershop.de', password: '!InterShop00!' };
    when(apiServiceMock.get(anything(), anything(), anything())).thenReturn(of({ authorized: true }));

    accountLoginService.signinUser(loginDetail).subscribe(data => {
      expect(data['authorized']).toBe(true);
    });

  });

  it('should return error message when wrong credentials are entered', () => {
    const errorMessage = '401 and Unauthorized';
    const userDetails = { userName: 'intershop@123.com', password: 'wrong' };
    when(apiServiceMock.get(anything(), anything(), anything())).thenReturn(ErrorObservable.create(new Error(errorMessage)));
    accountLoginService.signinUser(userDetails).subscribe((data) => {
      fail('no data in this path is expected');
    }, (error) => {
      expect(error).toBeTruthy();
      expect(error.message).toBe(errorMessage);
    });
  });
});
