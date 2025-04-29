import { overrides } from './environment.development';
import { ENVIRONMENT_DEFAULTS, Environment } from './environment.model';

export const environment: Environment = {
  ...ENVIRONMENT_DEFAULTS,

  icmChannel: 'inSPIRED-inTRONICS_Business-Site',

  themeColor: '#006b99',

  features: [
    ...ENVIRONMENT_DEFAULTS.features,
    'businessCustomerRegistration',
    'costCenters',
    'maps',
    'punchout',
    'quickorder',
    'quoting',
    'orderTemplates',
  ],

  ...overrides,

  sparque: {
    serverUrl: 'https://policy.test.intershop.com',
    wrapperApi: 'v2',
    workspaceName: 'intershop-project-base-v2-team2',
    apiName: 'PWA',
    channelId: 'ish',
    config: 'default',
    enablePrices: false,
  },
};
