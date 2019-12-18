import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { ContentPageComponent } from './content-page.component';

const contentPageRoutes: Routes = [
  {
    path: ':contentPageId',
    component: ContentPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(contentPageRoutes), SharedModule],
  declarations: [ContentPageComponent],
})
export class ContentPageModule {}
