import { Routes } from '@angular/router';
import { AccountOverviewPageContainerComponent } from '../account-overview-page/account-overview-page.container';
import { AccountPageContainerComponent } from './account-page.container';

export const accountPageRoutes: Routes = [
  {
    path: '',
    component: AccountPageContainerComponent,
    children: [
      {
        path: 'overview',
        data: { breadcrumbData: [{ key: 'account.overview.link' }] },
        component: AccountOverviewPageContainerComponent,
      },
      {
        path: 'profile',
        data: { breadcrumbData: [{ key: 'account.profile.link' }] },
        loadChildren: '../profile-settings-page/profile-settings-page.module#ProfileSettingsPageModule',
      },
      {
        path: 'orders',
        data: { breadcrumbData: [{ key: 'account.order_history.link' }] },
        loadChildren: '../order-history-page/order-history-page.module#OrderHistoryPageModule',
      },
      {
        path: 'quote-list',
        data: { breadcrumbData: [{ key: 'quote.quotes.link' }] },
        loadChildren: '../../../quoting/containers/quote-list-page/quote-list-page.module#QuoteListPageModule',
      },
      {
        path: 'quote',
        data: { breadcrumbData: [{ key: 'quote.quotes.link' }] },
        loadChildren: '../../../quoting/containers/quote-edit-page/quote-edit-page.module#QuoteEditPageModule',
      },
      {
        path: 'quote-request',
        data: {
          breadcrumbData: [
            { key: 'quote.quotes.link', link: '/account/quote-list' },
            { key: 'quote.quote_details.link' },
          ],
        },
        loadChildren:
          '../../../quoting/containers/quote-request-edit-page/quote-request-edit-page.module#QuoteRequestEditPageModule',
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'overview',
      },
    ],
  },
];
