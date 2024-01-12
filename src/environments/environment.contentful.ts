import { overrides } from './environment.development';
import { ENVIRONMENT_DEFAULTS, Environment } from './environment.model';

// For this contentful example the b2b environment settings are used

export const environment: Environment = {
  ...ENVIRONMENT_DEFAULTS,

  icmChannel: 'inSPIRED-inTRONICS_Business-Site',

  themeColor: '#688dc3',

  features: [
    ...ENVIRONMENT_DEFAULTS.features,
    'businessCustomerRegistration',
    'costCenters',
    'maps',
    'messageToMerchant',
    'punchout',
    'quickorder',
    'quoting',
    'orderTemplates',
  ],

  ...overrides,

  contentful: {
    apiUrl: 'https://cdn.contentful.com',
    spaceId: 'uciv2hz8ejmp',
    accessToken: '86WWXcgxegzQlYDBcdMN75EN2XcQVYMFxGJXZrbvjL4',
    environment: 'master',
  },
};
