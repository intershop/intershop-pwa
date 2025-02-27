import { overrides } from './environment.development';
import { ENVIRONMENT_DEFAULTS, Environment } from './environment.model';

export const environment: Environment = {
  ...ENVIRONMENT_DEFAULTS,

  icmChannel: 'inSPIRED-inTRONICS_Business-Site',

  themeColor: '#688dc3',

  sparque: {
    server_url: 'https://policy.test.intershop.com',
    wrapperAPI: 'v2',
    WorkspaceName: 'intershop-project-base-v2-team2',
    ApiName: 'PWA',
    ChannelId: 'ish',
  },

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
};
