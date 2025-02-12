import { overrides } from './environment.development';
import { ENVIRONMENT_DEFAULTS, Environment } from './environment.model';

export const environment: Environment = {
  ...ENVIRONMENT_DEFAULTS,

  icmChannel: 'inSPIRED-inTRONICS_Business-Site',

  themeColor: '#688dc3',

  /**
   * To use the sparque api wrapper follow following steps:
   * 1. download the sparque wrapper repository => git clone https://intershop-com@dev.azure.com/intershop-com/Products/_git/search-sparque-api-wrapper
   * 2. build the docker image => docker build -t sparque_wrapper:local .
   * 3. adapt the docker-compose.yml file:
   *   - change the image in the dotnet section form eusparqueops/sparque-api-wrapper to sparque_wrapper:local
   *   - add the team2 workspace and API(intershop-project-base-v2-team2|PWA) to the list for WORKSPACE_ENDPOINTSETS_WITHOUT_AUTH
   *   - set CACHE_SHOULD_CACHE to false
   * 4. start the docker-compose => docker-compose up -d
   * 5. to check if the sparque wrapper is running correctly open the url http://localhost:5755/swagger/index.html
  sparque: {
    server_url: 'http://host.docker.internal:28090',
    wrapperAPI: 'v2',
    WorkspaceName: 'intershop-project-base-v2-team2',
    ApiName: 'PWA',
    ChannelId: 'ish',
  },**/

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
