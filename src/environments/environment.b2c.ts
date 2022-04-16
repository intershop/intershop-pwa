import { overrides } from './environment.development';
import { ENVIRONMENT_DEFAULTS, Environment } from './environment.model';

export const environment: Environment = {
  ...ENVIRONMENT_DEFAULTS,

  icmChannel: 'inSPIRED-inTRONICS-Site',

  themeColor: '#ff6d00',

  features: [...ENVIRONMENT_DEFAULTS.features, 'guestCheckout', 'wishlists'],

  ...overrides,
};
