import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ReturnRequestModule } from '../../return-request.module';

import { ReturnOverviewPageComponent } from './return-overview-page.component';

const accountWishlistPageRoutes: Routes = [
  {
    path: '',
    component: ReturnOverviewPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(accountWishlistPageRoutes), ReturnRequestModule],
})
export class ReturnOverviewPageModule {}
