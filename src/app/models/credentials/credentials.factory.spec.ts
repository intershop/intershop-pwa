import { FormControl, FormGroup } from '@angular/forms';
import { CredentialsFactory } from './credentials.factory';
import { CredentialsData } from './credentials.interface';
import { Credentials } from './credentials.model';

describe('Credentials Factory', () => {
  describe('fromData', () => {
    it(`should return Credentials when getting a RawCredential`, () => {
      const credentials = CredentialsFactory.fromData({ login: 'login' } as CredentialsData);
      expect(credentials.login).toEqual('login');
    });
  });

  describe('toData', () => {
    it(`should return CredentialsData when getting a Credentials`, () => {
      const credentials = new Credentials();
      credentials.login = '12345';
      const credentialsdata = CredentialsFactory.toData(credentials);
      expect(credentialsdata.login).toEqual('12345', 'credentialsData login is returned');
    });
  });

  describe('fromValue', () => {
    const form = new FormGroup({
      login: new FormControl('login')
    });

    it(`should return Credentials data when getting a credentials form`, () => {
      const credentials = CredentialsFactory.fromValue(form.value);
      expect(credentials.login).toEqual('login');
      expect(credentials instanceof Credentials).toBeTruthy('credentials is an object of class Credentials');
    });

    it(`should return null when getting no credentials form`, () => {
      expect(CredentialsFactory.fromValue(null)).toBeFalsy();
    });
  });
});

