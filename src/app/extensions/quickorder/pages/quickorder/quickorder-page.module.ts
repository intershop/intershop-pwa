import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { QuickorderModule } from '../../quickorder.module';

import { QuickorderPageComponent } from './quickorder-page.component';

const quickorderPageRoutes: Routes = [{ path: '', component: QuickorderPageComponent }];

@NgModule({
  imports: [QuickorderModule, ReactiveFormsModule, RouterModule.forChild(quickorderPageRoutes)],
  declarations: [QuickorderPageComponent],
})
export class QuickorderPageModule {}
