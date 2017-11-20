import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../modules/shared.module';
import { ShoppingModule } from '../../modules/shopping.module';
import { ProductListService } from '../../services/products/products.service';
import { CategoryPageComponent } from './category-page.component';
import { CategoryPageRoute } from './category-page.routes';

@NgModule({
  imports: [
    RouterModule.forChild(CategoryPageRoute),
    CommonModule,
    ShoppingModule,
    SharedModule
  ],
  providers: [
    ProductListService
  ],
  declarations: [CategoryPageComponent]
})

export class CategoryPageModule {

}
