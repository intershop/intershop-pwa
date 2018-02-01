import { FormControl, FormGroup } from '@angular/forms';
import { CredentialsFactory } from '../credentials/credentials.factory';
import { CredentialsData } from './credentials.interface';

describe('Credentials Factory', () => {
  describe('fromData', () => {
    it(`should return Credentials when getting a RawCredential`, () => {
      const credentials = CredentialsFactory.fromData({ login: 'login' } as CredentialsData);
      expect(credentials.login).toEqual('login');
    });
  });

  describe('fromFormToData', () => {
    const form = new FormGroup({
      login: new FormControl('login')
    });

    it(`should return Credentials data when getting a credentials form`, () => {
      const credentials = CredentialsFactory.fromFormValueToData(form.value);
      expect(credentials.login).toEqual('login');
    });

    it(`should return null when getting no credentials form`, () => {
      expect(CredentialsFactory.fromFormValueToData(null)).toBeFalsy();
    });
  });
});

