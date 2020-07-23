import { TactonSelfServiceApiConfiguration } from '../tacton-self-service-api-configuration/tacton-self-service-api-configuration.model';

export interface TactonConfig {
  selfService: TactonSelfServiceApiConfiguration;
  productMappings?: { [sku: string]: string };
}
