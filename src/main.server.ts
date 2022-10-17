/***************************************************************************************************
 * Load `$localize` onto the global scope - used if i18n tags appear in Angular templates.
 */
// eslint-disable-next-line ish-custom-rules/ordered-imports
import '@angular/localize/init';
import { enableProdMode } from '@angular/core';

if (PRODUCTION_MODE) {
  enableProdMode();
}

export { AppServerModule } from './app/app.server.module';
export { environment } from './environments/environment';
export { HYBRID_MAPPING_TABLE, ICM_WEB_URL, ICM_CONFIG_MATCH } from './hybrid/default-url-mapping-table';
export { APP_BASE_HREF } from '@angular/common';
