import { CategoriesService } from './../../../shared/services/categories/categories.service';
import { CategoryPageComponent } from './category-page.component';

export const CategoryPageRoute = [
  { path: '**', component: CategoryPageComponent, resolve: { category: CategoriesService } }
];
