import { Routes } from '@angular/router';

import { OrderPageContainerComponent } from './order-page.container';

export const orderPageRoutes: Routes = [
  {
    path: '',
    component: OrderPageContainerComponent,
    children: [
      {
        path: '**',
        component: OrderPageContainerComponent,
      },
    ],
  },
];
