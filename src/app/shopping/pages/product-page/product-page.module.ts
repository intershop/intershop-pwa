import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { ProductResolver } from '../../resolvers/product.resolver';
import { ProductsService } from '../../services/products/products.service';
import { ShoppingSharedModule } from '../../shopping-shared.module';
import { ProductPageComponent } from './product-page.component';
import { productPageRoutes } from './product-page.routes';

@NgModule({
  imports: [
    RouterModule.forChild(productPageRoutes),
    SharedModule,
    ShoppingSharedModule
  ],
  declarations: [
    ProductPageComponent
  ],
  providers: [
    ProductResolver,
    ProductsService
  ]
})

export class ProductPageModule { }
