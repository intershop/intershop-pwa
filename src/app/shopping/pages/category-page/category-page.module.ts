import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProductListService } from '../../../shared/services/products/products.service';
import { SharedModule } from '../../../shared/shared.module';
import { CategoryResolver } from '../../resolvers/category.resolver';
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
    ProductListService
  ],
  declarations: [
    CategoryPageComponent
  ]
})

export class CategoryPageModule { }
