import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CategoryNavigationComponent } from './../components/category-navigation/category-navigation.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    CategoryNavigationComponent
  ],
  exports: [
    CategoryNavigationComponent
  ]
})
export class ShoppingModule { }
