import { Routes } from '@angular/router';
import { HomePageComponent } from './home-page.component';

export const homePageRoutes: Routes = [
  { path: '', component: HomePageComponent, data: { className: 'homepage' } }
];
