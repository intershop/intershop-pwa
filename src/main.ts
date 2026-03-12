import { enableProdMode, mergeApplicationConfig } from '@angular/core';
import { bootstrapApplication, provideClientHydration, withNoHttpTransferCache } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';

import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

if (PRODUCTION_MODE) {
  enableProdMode();
}

const browserConfig = mergeApplicationConfig(appConfig, {
  providers: [provideAnimations(), provideClientHydration(withNoHttpTransferCache())],
});

document.addEventListener('DOMContentLoaded', () => {
  bootstrapApplication(AppComponent, browserConfig).catch(err => console.error(err));
});
