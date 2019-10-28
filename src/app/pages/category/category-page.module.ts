import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { CategoryPageContainerComponent } from './category-page.container';
import { CategoryCategoriesComponent } from './components/category-categories/category-categories.component';
import { CategoryImageComponent } from './components/category-image/category-image.component';
import { CategoryListComponent } from './components/category-list/category-list.component';
import { CategoryNavigationComponent } from './components/category-navigation/category-navigation.component';
import { CategoryProductsComponent } from './components/category-products/category-products.component';
import { CategoryTileComponent } from './components/category-tile/category-tile.component';

const categoryPageRoutes: Routes = [
  {
    path: ':categoryUniqueId',
    component: CategoryPageContainerComponent,
  },
  {
    path: ':categoryUniqueId/product',
    loadChildren: () => import('../product/product-page.module').then(m => m.ProductPageModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(categoryPageRoutes), SharedModule],
  declarations: [
    CategoryCategoriesComponent,
    CategoryImageComponent,
    CategoryListComponent,
    CategoryNavigationComponent,
    CategoryPageContainerComponent,
    CategoryProductsComponent,
    CategoryTileComponent,
  ],
})
export class CategoryPageModule {}
