import { FactoryHelper } from '../factory-helper';
import { CredentialsData } from './credentials.interface';
import { Credentials } from './credentials.model';

export class CredentialsFactory {

  /*
    Converts credentialsData interface to credentials object
  */
  static fromData(data: CredentialsData): Credentials {

    const credentials: Credentials = new Credentials();
    if (data) {
      FactoryHelper.primitiveMapping<CredentialsData, Credentials>(data, credentials);
    }
    return credentials;
  }

  /*
    Converts credentials object to credentialsData interface
  */
  static toData(credentials: Credentials): CredentialsData {
    if (!credentials) {
      return null;
    }
    const credentialsData = new Object as CredentialsData;
    FactoryHelper.primitiveMapping<Credentials, CredentialsData>(credentials, credentialsData);
    return credentialsData;
  }

  /*
     Converts (form) value to credentials object
   */
  static fromValue(value: any): Credentials {
    if (!value) {
      return null;
    }

    const credentials = new Credentials();
    FactoryHelper.primitiveMapping<any, Credentials>(value, credentials, ['login', 'password', 'securityQuestion', 'securityQuestionAnswer']);

    return credentials;
  }
}
