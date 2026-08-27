import { enableProdMode } from '@angular/core';
import { platformBrowser } from '@angular/platform-browser';

import { AppModule } from './app/app.module';

if (PRODUCTION_MODE) {
  enableProdMode();
}

function bootstrap(): void {
  platformBrowser()
    .bootstrapModule(AppModule)
    .catch(err => console.error(err));
}

// bootstrap immediately when the DOM is already parsed (e.g. on HMR re-execution),
// otherwise wait for the initial DOMContentLoaded event
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap);
} else {
  bootstrap();
}
