import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PunchoutModule } from '../../punchout.module';

import { PunchoutPageGuard } from './punchout-page.guard';

const punchoutPageRoutes: Routes = [
  {
    path: '',
    children: [],
    canActivate: [PunchoutPageGuard],
  },
];

@NgModule({
  imports: [PunchoutModule, RouterModule.forChild(punchoutPageRoutes)],
  providers: [PunchoutPageGuard],
})
export class PunchoutPageModule {}
