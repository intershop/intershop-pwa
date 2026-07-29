import { enableProdMode } from '@angular/core';
import { platformBrowser } from '@angular/platform-browser';

import { AppModule } from './app/app.module';

if (PRODUCTION_MODE) {
  enableProdMode();
}

document.addEventListener('DOMContentLoaded', () => {
  platformBrowser()
    .bootstrapModule(AppModule)
    .catch(err => console.error(err));
});
