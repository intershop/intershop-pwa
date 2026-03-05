import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';

import { CoreModule } from 'ish-core/core.module';

import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(appRoutes), provideNoopAnimations(), importProvidersFrom(CoreModule)],
};
