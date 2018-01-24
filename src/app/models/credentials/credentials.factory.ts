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
}
