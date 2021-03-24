import { TestBed } from '@angular/core/testing';

import { RegistrationConfigurationService } from './registration-configuration.service';

describe('Registration Configuration Service', () => {
  let registrationConfigurationService: RegistrationConfigurationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RegistrationConfigurationService],
    });
    registrationConfigurationService = TestBed.inject(RegistrationConfigurationService);
  });

  it('should be created', () => {
    expect(registrationConfigurationService).toBeTruthy();
  });
});
