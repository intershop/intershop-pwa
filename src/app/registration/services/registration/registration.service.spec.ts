import { of } from 'rxjs/observable/of';
import { _throw } from 'rxjs/observable/throw';
import { anything, instance, mock, verify, when } from 'ts-mockito';
import { ApiService } from '../../../core/services/api.service';
import { SmbCustomerUser } from '../../../models/customer/smb-customer-user.model';
import { RegistrationService } from './registration.service';

describe('Registration Service', () => {
  let registrationService: RegistrationService;
  const apiServiceMock = mock(ApiService);

  beforeEach(() => {
    registrationService = new RegistrationService(instance(apiServiceMock));
  });

  it('should login the user when correct credentials are entered', () => {
    const loginDetail = { login: 'patricia@test.intershop.de', password: '!InterShop00!' };
    when(apiServiceMock.get(anything(), anything(), anything())).thenReturn(of({ authorized: true }));

    registrationService.signinUser(loginDetail).subscribe(data => {
      expect(data['authorized']).toBe(true);
    });
  });

  it('should return error message when wrong credentials are entered', () => {
    const errorMessage = '401 and Unauthorized';
    const userDetails = { login: 'intershop@123.com', password: 'wrong' };
    when(apiServiceMock.get(anything(), anything(), anything())).thenReturn(_throw(new Error(errorMessage)));
    registrationService.signinUser(userDetails).subscribe(
      data => {
        fail('no data in this path is expected');
      },
      error => {
        expect(error).toBeTruthy();
        expect(error.message).toBe(errorMessage);
      }
    );
  });

  it("should get comapny user data  data when 'getCompanyUserData' is called", () => {
    const userData = {
      type: 'SMBCustomerUser',
    } as SmbCustomerUser;

    when(apiServiceMock.get('customers/-/users/-')).thenReturn(of(userData));

    registrationService.getCompanyUserData().subscribe(data => {
      expect(data.type).toEqual(userData.type);
    });

    verify(apiServiceMock.get('customers/-/users/-')).once();
  });
});
