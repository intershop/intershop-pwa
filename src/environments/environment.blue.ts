import { overrides } from './environment.development';
import { ENVIRONMENT_DEFAULTS, Environment } from './environment.model';

export const environment: Environment = {
  ...ENVIRONMENT_DEFAULTS,

  icmChannel: 'inSPIRED-inTRONICS_Business-Site',

  themeColor: '#688dc3',

  features: [
    'compare',
    'recently',
    'rating',
    'advancedVariationHandling',
    'businessCustomerRegistration',
    'costCenters',
    'quoting',
    'quickorder',
    'orderTemplates',
    'punchout',
  ],

  ...overrides,
};
