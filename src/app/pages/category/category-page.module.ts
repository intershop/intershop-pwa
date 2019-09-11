import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { CategoryPageContainerComponent } from './category-page.container';
import { CategoryImageComponent } from './components/category-image/category-image.component';
import { CategoryListComponent } from './components/category-list/category-list.component';
import { CategoryNavigationComponent } from './components/category-navigation/category-navigation.component';
import { CategoryPageComponent } from './components/category-page/category-page.component';
import { CategoryTileComponent } from './components/category-tile/category-tile.component';
import { FamilyPageComponent } from './components/family-page/family-page.component';

const categoryPageRoutes: Routes = [
  {
    path: ':categoryUniqueId',
    component: CategoryPageContainerComponent,
  },
  {
    path: ':categoryUniqueId/product',
    loadChildren: '../product/product-page.module#ProductPageModule',
  },
];

@NgModule({
  imports: [RouterModule.forChild(categoryPageRoutes), SharedModule],
  declarations: [
    CategoryImageComponent,
    CategoryListComponent,
    CategoryNavigationComponent,
    CategoryPageComponent,
    CategoryPageContainerComponent,
    CategoryTileComponent,
    FamilyPageComponent,
  ],
})
export class CategoryPageModule {}
