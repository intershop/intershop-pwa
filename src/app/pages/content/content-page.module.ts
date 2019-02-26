import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CMSModule } from '../../cms/cms.module';
import { SharedModule } from '../../shared/shared.module';

import { ContentPageComponent } from './components/content-page/content-page.component';
import { ContentPageContainerComponent } from './content-page.container';

const contentPageRoutes: Routes = [
  {
    path: ':contentPageId',
    component: ContentPageContainerComponent,
  },
];

@NgModule({
  imports: [CMSModule, RouterModule.forChild(contentPageRoutes), SharedModule],
  declarations: [ContentPageComponent, ContentPageContainerComponent],
})
export class ContentPageModule {}
