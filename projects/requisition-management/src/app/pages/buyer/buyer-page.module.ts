import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { RequisitionManagementModule } from '../../requisition-management.module';

import { BuyerPageComponent } from './buyer-page.component';

const buyerPageRoutes: Routes = [{ path: '', component: BuyerPageComponent }];

@NgModule({
  imports: [RequisitionManagementModule, RouterModule.forChild(buyerPageRoutes), SharedModule],
  declarations: [BuyerPageComponent],
})
export class BuyerPageModule {}
