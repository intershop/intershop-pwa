import { Routes } from '@angular/router';
import { CategoryPathResolver } from '../../resolvers/category-path.resolver';
import { CategoryResolver } from '../../resolvers/category.resolver';
import { CategoryPageComponent } from './category-page.component';

export const categoryPageRoutes: Routes = [
  {
    path: '**', component: CategoryPageComponent,
    resolve: {
      category: CategoryResolver,
      categoryPath: CategoryPathResolver
    }
  }
];
