import { Routes } from '@angular/router';
import { ErrorPageComponent } from './error-page.component';

export const errorPageRoutes: Routes = [
  { path: '', component: ErrorPageComponent, data: { className: 'errorpage' } }
];
