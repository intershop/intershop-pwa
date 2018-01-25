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

  static fromForm(form: FormGroup) {
    if (!form) {
      return null;
    }
    const credentials: Credentials = new Credentials();
    FactoryHelper.primitiveMapping<FormGroup, Credentials>(form.value, credentials, ['login', 'password', 'securityQuestion', 'securityQuestionAnswer']);
    return credentials;
  }
}
