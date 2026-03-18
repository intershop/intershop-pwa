import { ApplicationConfig } from '@angular/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';

import { provideCore } from 'ish-core/core.providers';

import { appRoutes } from './app.routes';
import { provideOrganizationManagementStore } from './app/store/organization-management-store.providers';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(appRoutes), provideNoopAnimations(), provideCore(), provideOrganizationManagementStore()],
};
