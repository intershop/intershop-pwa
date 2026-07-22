import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { DataRequestPageComponent } from './data-request-page.component';

const dataRequestPageRoutes: Routes = [{ path: '**', component: DataRequestPageComponent }];

@NgModule({
  declarations: [DataRequestPageComponent],
  imports: [RouterModule.forChild(dataRequestPageRoutes), SharedModule],
})
export class DataRequestPageModule {}
