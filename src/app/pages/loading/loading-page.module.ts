import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { LoadingPageComponent } from './loading-page.component';

const loadingPageRoutes: Routes = [
  {
    path: '',
    component: LoadingPageComponent,
    data: {
      wrapperClass: 'errorpage',
      headerType: 'simple',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(loadingPageRoutes), SharedModule],
  declarations: [LoadingPageComponent],
})
export class LoadingPageModule {}
