import { enableProdMode } from '@angular/core';

if (PRODUCTION_MODE) {
  enableProdMode();
}

export { AppServerModule, AppServerModule as default } from './app/app.server.module';
export { environment } from './environments/environment';
export { HYBRID_MAPPING_TABLE, ICM_WEB_URL, ICM_CONFIG_MATCH } from './hybrid/default-url-mapping-table';
export { APP_BASE_HREF } from '@angular/common';
