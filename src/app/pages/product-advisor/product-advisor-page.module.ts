import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { ProductAdvisorPageComponent } from './product-advisor-page.component';

const productAdvisorPageRoutes: Routes = [{ path: '', component: ProductAdvisorPageComponent }];

@NgModule({
  imports: [RouterModule.forChild(productAdvisorPageRoutes), SharedModule],
  declarations: [ProductAdvisorPageComponent],
})
export class ProductAdvisorPageModule {}
