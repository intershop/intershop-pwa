import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../../../shared/shared.module';
import { ContentPageComponent } from '../../components/content-page/content-page.component';

import { ContentPageContainerComponent } from './content-page.container';
import { contentPageRoutes } from './content-page.routes';

@NgModule({
  imports: [RouterModule.forChild(contentPageRoutes), SharedModule],
  declarations: [ContentPageContainerComponent, ContentPageComponent],
})
export class ContentPageModule {}
