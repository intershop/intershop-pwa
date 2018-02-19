import { Routes } from '@angular/router';
import { ErrorPageContainerComponent } from './error-page.container';

export const errorPageRoutes: Routes = [
  { path: '', component: ErrorPageContainerComponent, data: { className: 'errorpage' } }
];
