import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CategoryImageComponent } from 'ish-shared/components/category/category-image/category-image.component';
import { SharedModule } from 'ish-shared/shared.module';

import { CategoryCategoriesComponent } from './category-categories/category-categories.component';
import { CategoryListComponent } from './category-list/category-list.component';
import { CategoryNavigationComponent } from './category-navigation/category-navigation.component';
import { CategoryPageComponent } from './category-page.component';
import { CategoryProductsComponent } from './category-products/category-products.component';
import { CategoryTileComponent } from './category-tile/category-tile.component';

const categoryPageRoutes: Routes = [
  {
    // compatibility to old routes
    path: 'category/:categoryUniqueId',
    component: CategoryPageComponent,
  },
  {
    // route to handle category links managed by CMS
    path: 'categoryref/:categoryRefId',
    component: CategoryPageComponent,
  },
  { path: '**', component: CategoryPageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(categoryPageRoutes), CategoryImageComponent, SharedModule],
  declarations: [
    CategoryCategoriesComponent,
    CategoryListComponent,
    CategoryNavigationComponent,
    CategoryPageComponent,
    CategoryProductsComponent,
    CategoryTileComponent,
  ],
})
export class CategoryPageModule {}
