import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CategoryFamilyHostComponent } from '../../components/category-family-host/category-family-host.component';
import { ShoppingModule } from '../../modules/shopping.module';
import { FamilyPageModule } from '../family-page/family-page.module';
import { CategoryPageComponent } from './category-page.component';
import { CategoryPageRoute } from './category-page.routes';

@NgModule({
  imports: [
    CommonModule,
    FamilyPageModule,
    RouterModule.forChild(CategoryPageRoute),
    ShoppingModule
  ],
  declarations: [CategoryPageComponent, CategoryFamilyHostComponent]
})

export class CategoryPageModule {

}
