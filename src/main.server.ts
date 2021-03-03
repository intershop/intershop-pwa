// tslint:disable-next-line: ish-ordered-imports
/***************************************************************************************************
 * Load `$localize` onto the global scope - used if i18n tags appear in Angular templates.
 */
import '@angular/localize/init';
import { enableProdMode } from '@angular/core';

if (PRODUCTION_MODE) {
  enableProdMode();
}

export { AppServerModule } from './app/app.server.module';
export { ngExpressEngine } from '@nguniversal/express-engine';
export { environment } from './environments/environment';
export { HYBRID_MAPPING_TABLE, ICM_WEB_URL } from './hybrid/default-url-mapping-table';

export { renderModule, renderModuleFactory } from '@angular/platform-server';
export { APP_BASE_HREF } from '@angular/common';
