import { Routes } from '@angular/router';
import { CategoryGuard } from '../../guards/category.guard';
import { CategoryPageComponent } from './category-page.component';

export const categoryPageRoutes: Routes = [
  {
    path: '**', component: CategoryPageComponent,
    canActivate: [CategoryGuard]
  }
];
