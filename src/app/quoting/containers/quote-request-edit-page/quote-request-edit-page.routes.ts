import { Routes } from '@angular/router';
import { QuoteRequestEditPageContainerComponent } from './quote-request-edit-page.container';

export const quoteRequestEditPageRoutes: Routes = [
  {
    path: ':quoteRequestId',
    component: QuoteRequestEditPageContainerComponent,
  },
];
