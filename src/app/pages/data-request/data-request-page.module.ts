import { importProvidersFrom } from '@angular/core';
import { Routes } from '@angular/router';

import { FormlyModule as IshFormlyModule } from 'ish-shared/formly/formly.module';

export const dataRequestPageRoutes: Routes = [
  {
    path: '**',
    loadComponent: () => import('./data-request-page.component').then(m => m.DataRequestPageComponent),
    providers: [importProvidersFrom(IshFormlyModule)],
  },
];
