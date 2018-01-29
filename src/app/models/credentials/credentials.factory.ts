import { FormGroup } from '@angular/forms';
import { FactoryHelper } from '../factory-helper';
import { CredentialsData } from './credentials.interface';
import { Credentials } from './credentials.model';


export class CredentialsFactory {

  static fromData(data: CredentialsData): Credentials {

    const credentials: Credentials = new Credentials();
    if (data) {
      FactoryHelper.primitiveMapping<CredentialsData, Credentials>(data, credentials);
    }
    return credentials;
  }

  static fromFormToData(form: FormGroup) {
    if (!form) {
      return null;
    }
    const credentialsData = new Object as CredentialsData;
    FactoryHelper.primitiveMapping<FormGroup, CredentialsData>(form.value, credentialsData, ['login', 'password', 'securityQuestion', 'securityQuestionAnswer']);
    return credentialsData;
  }
}
