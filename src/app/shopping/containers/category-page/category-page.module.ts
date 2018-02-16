import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { ProductsService } from '../../services/products/products.service';
import { ShoppingSharedModule } from '../../shopping-shared.module';
import { CategoryPageContainerComponent } from './category-page.container';
import { categoryPageRoutes } from './category-page.routes';

@NgModule({
  imports: [
    RouterModule.forChild(categoryPageRoutes),
    SharedModule,
    ShoppingSharedModule
  ],
  providers: [
    ProductsService
  ],
  declarations: [
    CategoryPageContainerComponent
  ]
})

export class CategoryPageModule { }
