import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ReturnRequestModule } from '../../return-request.module';

import { ReturnOverviewPageComponent } from './return-overview-page.component';

const returnRequestOverviewPageRoutes: Routes = [
  {
    path: '',
    component: ReturnOverviewPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(returnRequestOverviewPageRoutes), ReturnRequestModule],
})
export class ReturnOverviewPageModule {}
