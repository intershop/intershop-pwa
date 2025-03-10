import { overrides } from './environment.development';
import { ENVIRONMENT_DEFAULTS, Environment } from './environment.model';

export const environment: Environment = {
  ...ENVIRONMENT_DEFAULTS,

  icmChannel: 'inSPIRED-inTRONICS-Site',

  themeColor: '#006f6f',

  features: [...ENVIRONMENT_DEFAULTS.features, 'guestCheckout', 'wishlists'],

  ...overrides,
};
