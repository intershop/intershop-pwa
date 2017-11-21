import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProductListService } from '../../../shared/services/products/products.service';
import { SharedModule } from '../../../shared/shared.module';
import { ShoppingModule } from '../../shopping.module';
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
