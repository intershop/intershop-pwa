import { enableProdMode } from '@angular/core';

import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

export { AppServerModule } from './app/app.server.module';
export { ngExpressEngine } from '@nguniversal/express-engine';
export { environment } from './environments/environment';
export { HYBRID_MAPPING_TABLE, ICM_WEB_URL } from './hybrid/default-url-mapping-table';

export { renderModule, renderModuleFactory } from '@angular/platform-server';