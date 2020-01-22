import { enableProdMode } from '@angular/core';

import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

export { AppServerModule } from './app/app.server.module';
export { ngExpressEngine } from '@nguniversal/express-engine';
export { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader';
export { environment } from './environments/environment';
export { HYBRID_MAPPING_TABLE } from './hybrid/default-url-mapping-table';
