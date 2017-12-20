import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { CategoryResolver } from '../../resolvers/category.resolver';
import { ProductsService } from '../../services/products/products.service';
import { ShoppingSharedModule } from '../../shopping-shared.module';
import { CategoryPageComponent } from './category-page.component';
import { categoryPageRoutes } from './category-page.routes';

@NgModule({
  imports: [
    RouterModule.forChild(categoryPageRoutes),
    SharedModule,
    ShoppingSharedModule
  ],
  providers: [
    CategoryResolver,
    ProductsService
  ],
  declarations: [
    CategoryPageComponent
  ]
})

export class CategoryPageModule { }
