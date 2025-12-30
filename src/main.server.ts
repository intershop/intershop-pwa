/***************************************************************************************************
 * Load `$localize` onto the global scope - used if i18n tags appear in Angular templates.
 */
import { enableProdMode } from '@angular/core';
import '@angular/localize/init';

if (PRODUCTION_MODE) {
  enableProdMode();
}

export { AppServerModule } from './app/app.server.module';
export { environment } from './environments/environment';
export { HYBRID_MAPPING_TABLE, ICM_WEB_URL, ICM_CONFIG_MATCH } from './hybrid/default-url-mapping-table';
export { APP_BASE_HREF } from '@angular/common';
