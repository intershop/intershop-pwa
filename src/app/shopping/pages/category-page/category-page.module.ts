import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CategoryResolver } from '../../../shared/resolvers/category.resolver';
import { ProductListService } from '../../../shared/services/products/products.service';
import { SharedModule } from '../../../shared/shared.module';
import { ShoppingModule } from '../../shopping.module';
import { CategoryPageComponent } from './category-page.component';
import { CategoryPageRoute } from './category-page.routes';

@NgModule({
  imports: [
    RouterModule.forChild(CategoryPageRoute),
    SharedModule,
    ShoppingModule
  ],
  providers: [
    CategoryResolver,
    ProductListService
  ],
  declarations: [
    CategoryPageComponent
  ]
})

export class CategoryPageModule {

}
