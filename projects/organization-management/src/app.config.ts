import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';

import { CoreModule } from 'ish-core/core.module';

import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(appRoutes), importProvidersFrom(CoreModule, NoopAnimationsModule)],
};
