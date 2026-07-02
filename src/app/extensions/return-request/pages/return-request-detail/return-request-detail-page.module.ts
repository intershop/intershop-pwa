import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ReturnRequestModule } from '../../return-request.module';

import { ReturnRequestDetailPageComponent } from './return-request-detail-page.component';

const returnRequestDetailPageRoutes: Routes = [
  {
    path: '',
    component: ReturnRequestDetailPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(returnRequestDetailPageRoutes), ReturnRequestModule],
})
export class ReturnRequestDetailPageModule {}
