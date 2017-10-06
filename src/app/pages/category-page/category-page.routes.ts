import { CategoryPageComponent } from './category-page.component';

export const CategoryPageRoute = [
  { path: ':category-id', component: CategoryPageComponent },
  { path: ':category-id/:category-id', component: CategoryPageComponent },
  { path: ':category-id/:category-id/:category-id', component: CategoryPageComponent },
  { path: ':category-id/:category-id/:category-id/:category-id', component: CategoryPageComponent },
  { path: ':category-id/:category-id/:category-id/:category-id/:category-id', component: CategoryPageComponent }
];
