import { CategoryPageComponent } from './category-page.component';

export const CategoryPageRoute = [
  { path: '', component: CategoryPageComponent },
  { path: 'family/:subcategory', loadChildren: 'app/pages/family-page/family-page.module#FamilyPageModule' }
];
