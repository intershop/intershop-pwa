import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PunchoutModule } from '../../punchout.module';

import { punchoutPageGuard } from './punchout-page.guard';

const punchoutPageRoutes: Routes = [
  {
    path: '',
    children: [],
    canActivate: [punchoutPageGuard],
  },
];

@NgModule({
  imports: [PunchoutModule, RouterModule.forChild(punchoutPageRoutes)],
})
export class PunchoutPageModule {}
