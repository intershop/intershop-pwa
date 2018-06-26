import { Routes } from '@angular/router';
import { QuoteEditPageContainerComponent } from './quote-edit-page.container';

export const quoteEditPageRoutes: Routes = [
  {
    path: ':quoteId',
    component: QuoteEditPageContainerComponent,
  },
];
