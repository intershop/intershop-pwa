import { Routes } from '@angular/router';
import { CategoryIdResolver } from '../../resolvers/categoryId.resolver';
import { CategoryPageComponent } from './category-page.component';

export const categoryPageRoutes: Routes = [
  {
    path: '**', component: CategoryPageComponent,
    resolve: {
      categoryId: CategoryIdResolver
    }
  }
];
