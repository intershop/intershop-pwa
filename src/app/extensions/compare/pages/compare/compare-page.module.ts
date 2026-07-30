import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { ComparePageComponent } from './compare-page.component';
import { ProductCompareListComponent } from './product-compare-list/product-compare-list.component';
import { ProductComparePagingComponent } from './product-compare-paging/product-compare-paging.component';

const comparePageRoutes: Routes = [{ path: '', component: ComparePageComponent }];

@NgModule({
  imports: [RouterModule.forChild(comparePageRoutes), SharedModule],
  declarations: [ComparePageComponent, ProductCompareListComponent, ProductComparePagingComponent],
})
export class ComparePageModule {}
