import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { ContentPageComponent } from './components/content-page/content-page.component';
import { ContentPageContainerComponent } from './content-page.container';

const contentPageRoutes: Routes = [
  {
    path: ':contentPageId',
    component: ContentPageContainerComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(contentPageRoutes), SharedModule],
  declarations: [ContentPageComponent, ContentPageContainerComponent],
})
export class ContentPageModule {}
