import { Routes } from '@angular/router';

import { HomePageContainerComponent } from './home-page.container';

export const homePageRoutes: Routes = [
  { path: '', component: HomePageContainerComponent, data: { wrapperClass: 'homepage' } },
];
