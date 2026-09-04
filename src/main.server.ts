import { enableProdMode } from '@angular/core';

import { AppServerModule } from './app/app.server.module';

if (PRODUCTION_MODE) {
  enableProdMode();
}

export { AppServerModule };

export default AppServerModule;

export { environment } from './environments/environment';

export { HYBRID_MAPPING_TABLE, ICM_WEB_URL, ICM_CONFIG_MATCH } from './hybrid/default-url-mapping-table';
export { APP_BASE_HREF } from '@angular/common';
