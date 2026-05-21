import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { QuickorderModule } from '../../quickorder.module';

import { QuickorderPageComponent } from './quickorder-page.component';

const quickorderPageRoutes: Routes = [{ path: '', component: QuickorderPageComponent }];

@NgModule({
  declarations: [QuickorderPageComponent],
  imports: [QuickorderModule, RouterModule.forChild(quickorderPageRoutes)],
})
export class QuickorderPageModule {}
