import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { ProductCompareListComponent } from '../../components/product/product-compare-list/product-compare-list.component';
import { ComparePageContainerComponent } from './compare-page.container';
import { comparePageRoutes } from './compare-page.routes';

@NgModule({
  imports: [
    RouterModule.forChild(comparePageRoutes),
    SharedModule
  ],
  declarations: [
    ComparePageContainerComponent,
    ProductCompareListComponent
  ]
})

export class ComparePageModule { }
