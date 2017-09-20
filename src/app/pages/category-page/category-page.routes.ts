import { CategoryPageComponent } from './category-page.component';
import { DeciderComponent } from './decider.component';

export const CategoryPageRoute = [
  { path: ':category-name', component: CategoryPageComponent },
  { path: ':category-name/:subcategory', component: DeciderComponent },
  { path: ':category-name/:subcategory/:subcategory', loadChildren: 'app/pages/family-page/family-page.module#FamilyPageModule' }
];
