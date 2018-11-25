import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { QuotingSharedModule } from '../../extensions/quoting/shared/quoting-shared.module';
import { SharedModule } from '../../shared/shared.module';

import { CategoryPageContainerComponent } from './category-page.container';
import { CategoryListComponent } from './components/category-list/category-list.component';
import { CategoryNavigationComponent } from './components/category-navigation/category-navigation.component';
import { CategoryPageComponent } from './components/category-page/category-page.component';
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
  imports: [QuotingSharedModule, RouterModule.forChild(categoryPageRoutes), SharedModule],
  declarations: [
    CategoryListComponent,
    CategoryNavigationComponent,
    CategoryPageComponent,
    CategoryPageContainerComponent,
    FamilyPageComponent,
  ],
})
export class CategoryPageModule {}
