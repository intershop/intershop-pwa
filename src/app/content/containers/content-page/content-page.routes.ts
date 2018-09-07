import { Routes } from '@angular/router';

import { ContentPageContainerComponent } from './content-page.container';

export const contentPageRoutes: Routes = [
  {
    path: ':contentPageId',
    component: ContentPageContainerComponent,
  },
];
