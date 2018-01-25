import { of } from 'rxjs/observable/of';
import { anything, instance, mock, when } from 'ts-mockito';
import { AccountLoginService } from '../../core/services/account-login/account-login.service';
import { ApiService } from '../../core/services/api.service';
import { Customer } from '../../models/customer/customer.model';
import { CustomerRegistrationService } from './customer-registration.service';

describe('Customer Registration Service', () => {

  let customerRegistrationService: CustomerRegistrationService;
  const accountLoginServiceMock = mock(AccountLoginService);
  const apiServiceMock = mock(ApiService);


  beforeEach(() => {
    customerRegistrationService = new CustomerRegistrationService(instance(accountLoginServiceMock), instance(apiServiceMock));
  });

  const newCustomer = <Customer>{
    id: '1224',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@test.test.xx',
    credentials: {
      login: 'john.doe@test.test.xx'
    }
  };

  it('should register a customer and when successful log him in', () => {
    when(apiServiceMock.post(anything(), anything())).thenReturn(of({ 'id': '1224' }));
    when(accountLoginServiceMock.singinUser(anything())).thenReturn(of(newCustomer));

    customerRegistrationService.registerPrivateCustomer(newCustomer).subscribe(data => {
      const registeredCustomer = data;
      expect(registeredCustomer.id).toEqual('1224');
    }).unsubscribe();

  });

  it('should return null if no customer is given', () => {
    expect(customerRegistrationService.registerPrivateCustomer(null)).toBeNull();
  });


});
