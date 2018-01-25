import { FormControl, FormGroup } from '@angular/forms';
import { CredentialsFactory } from '../credentials/credentials.factory';
import { CredentialsData } from './credentials.interface';

describe('Credentials Factory', () => {
  describe('fromData', () => {
    it(`should return Credentials when getting a RawCredential`, () => {
      expect(CredentialsFactory.fromData({ login: '1' } as CredentialsData)).toBeTruthy();
    });
  });

  describe('fromForm', () => {
    const form = new FormGroup({
      login: new FormControl('login'),
      password: new FormControl('1234')
    });

    it(`should return Credentials when getting a credentials form`, () => {
      expect(CredentialsFactory.fromForm(form)).toBeTruthy();
    });

    it(`should return null when getting no credentials form`, () => {
      expect(CredentialsFactory.fromForm(null)).toBeFalsy();
    });
  });
});

