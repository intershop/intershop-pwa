import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ShoppingModule } from '../../modules/shopping.module';
import { ProductListService } from '../../services/products/products.service';
import { CategoryPageComponent } from './category-page.component';
import { CategoryPageRoute } from './category-page.routes';

@NgModule({
  imports: [
    RouterModule.forChild(CategoryPageRoute),
    CommonModule,
    ShoppingModule
  ],
  providers: [
    ProductListService,
  ],
  declarations: [CategoryPageComponent]
})

export class CategoryPageModule {

}
