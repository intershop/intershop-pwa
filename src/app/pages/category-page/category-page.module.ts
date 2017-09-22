import { ShoppingModule } from './../../modules/shopping.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryPageComponent } from './category-page.component';
import { RouterModule } from '@angular/router';
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
