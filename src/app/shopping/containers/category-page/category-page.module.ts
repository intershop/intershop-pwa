import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { CategoryPageComponent } from '../../components/category/category-page/category-page.component';
import { FamilyPageComponent } from '../../components/category/family-page/family-page.component';
import { ShoppingSharedModule } from '../../shopping-shared.module';
import { CategoryPageContainerComponent } from './category-page.container';
import { categoryPageRoutes } from './category-page.routes';

@NgModule({
  imports: [RouterModule.forChild(categoryPageRoutes), SharedModule, ShoppingSharedModule],
  declarations: [CategoryPageContainerComponent, CategoryPageComponent, FamilyPageComponent],
})
export class CategoryPageModule {}
