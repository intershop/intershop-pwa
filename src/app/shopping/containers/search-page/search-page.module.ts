import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { CategoryPageComponent } from '../../components/category/category-page/category-page.component';
import { FamilyPageComponent } from '../../components/category/family-page/family-page.component';
import { ProductsService } from '../../services/products/products.service';
import { ShoppingSharedModule } from '../../shopping-shared.module';
import { searchPageRoutes } from './search-page.routes';
import { SearchPageContainerComponent } from './search-page.container';

@NgModule({
  imports: [
    RouterModule.forChild(searchPageRoutes),
    SharedModule,
    ShoppingSharedModule
  ],
  providers: [
    ProductsService
  ],
  declarations: [
    SearchPageContainerComponent,
  ]
})

export class SearchPageModule { }
