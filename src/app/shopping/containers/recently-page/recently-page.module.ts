import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { ProductsService } from '../../services/products/products.service';
import { ShoppingSharedModule } from '../../shopping-shared.module';
import { RecentlyPageContainerComponent } from './recently-page.container';
import { recentlyPageRoutes } from './recently-page.routes';

@NgModule({
  imports: [
    RouterModule.forChild(recentlyPageRoutes),
    SharedModule,
    ShoppingSharedModule
  ],
  providers: [
    ProductsService
  ],
  declarations: [
    RecentlyPageContainerComponent
  ]
})

export class RecentlyPageModule { }
