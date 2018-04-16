import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsSharedModule } from '../../../forms/forms-shared.module';
import { SharedModule } from '../../../shared/shared.module';
import { ProductDetailComponent } from '../../components/product/product-detail/product-detail.component';
import { ShoppingSharedModule } from '../../shopping-shared.module';
import { ProductPageContainerComponent } from './product-page.container';
import { productPageRoutes } from './product-page.routes';

@NgModule({
  imports: [RouterModule.forChild(productPageRoutes), SharedModule, FormsSharedModule, ShoppingSharedModule],
  declarations: [ProductPageContainerComponent, ProductDetailComponent],
})
export class ProductPageModule {}
