import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ShoppingModule } from '../../modules/shopping.module';
import { CategoryPageComponent } from './category-page.component';
import { CategoryPageRoute } from './category-page.routes';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(CategoryPageRoute),
    ShoppingModule
  ],
  declarations: [CategoryPageComponent]
})

export class CategoryPageModule {

}
