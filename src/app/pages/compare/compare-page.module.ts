import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { ComparePageContainerComponent } from './compare-page.container';
import { ProductCompareListComponent } from './components/product-compare-list/product-compare-list.component';
import { ProductComparePagingComponent } from './components/product-compare-paging/product-compare-paging.component';

const comparePageRoutes: Routes = [{ path: '', component: ComparePageContainerComponent }];

@NgModule({
  imports: [RouterModule.forChild(comparePageRoutes), SharedModule],
  declarations: [ComparePageContainerComponent, ProductCompareListComponent, ProductComparePagingComponent],
})
export class ComparePageModule {}
