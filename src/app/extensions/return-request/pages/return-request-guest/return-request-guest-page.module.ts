import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ReturnRequestModule } from '../../return-request.module';

import { ReturnRequestGuestPageComponent } from './return-request-guest-page.component';

const returnRequestGuestPageRoute: Routes = [
  {
    path: '',
    component: ReturnRequestGuestPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(returnRequestGuestPageRoute), ReturnRequestModule],
})
export class ReturnRequestGuestPageModule {}
