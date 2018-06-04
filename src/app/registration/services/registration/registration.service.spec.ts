import { of, throwError } from 'rxjs';
import { anything, instance, mock, verify, when } from 'ts-mockito';
import { ApiService } from '../../../core/services/api/api.service';
import { User } from '../../../models/user/user.model';
import { RegistrationService } from './registration.service';

describe('Registration Service', () => {
  let registrationService: RegistrationService;
  const apiServiceMock = mock(ApiService);

  beforeEach(() => {
    registrationService = new RegistrationService(instance(apiServiceMock));
  });

  it('should login the user when correct credentials are entered', done => {
    const loginDetail = { login: 'patricia@test.intershop.de', password: '!InterShop00!' };
    when(apiServiceMock.get(anything(), anything())).thenReturn(of({ authorized: true }));

    registrationService.signinUser(loginDetail).subscribe(data => {
      expect(data['authorized']).toBeTrue();
      done();
    });
  });

  it('should return error message when wrong credentials are entered', done => {
    const errorMessage = '401 and Unauthorized';
    const userDetails = { login: 'intershop@123.com', password: 'wrong' };
    when(apiServiceMock.get(anything(), anything())).thenReturn(throwError(new Error(errorMessage)));
    registrationService.signinUser(userDetails).subscribe(
      data => {
        fail('no data in this path is expected');
        done();
      },
      error => {
        expect(error).toBeTruthy();
        expect(error.message).toBe(errorMessage);
        done();
      }
    );
  });

  it("should get comapny user data  data when 'getCompanyUserData' is called", done => {
    const userData = {
      type: 'SMBCustomerUser',
    } as User;

    when(apiServiceMock.get('customers/-/users/-')).thenReturn(of(userData));

    registrationService.getCompanyUserData().subscribe(data => {
      expect(data.type).toEqual(userData.type);
      verify(apiServiceMock.get('customers/-/users/-')).once();
      done();
    });
  });
});
