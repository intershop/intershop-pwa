import { CategoryResolver } from '../../../shared/resolvers/category.resolver';
import { CategoryPageComponent } from './category-page.component';

export const CategoryPageRoute = [
  { path: '**', component: CategoryPageComponent, resolve: { category: CategoryResolver } }
];
