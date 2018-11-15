import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CMSSharedModule } from '../../../shared/cms/cms.module';
import { SharedModule } from '../../../shared/shared.module';
import { HomePageComponent } from '../../components/home/home-page/home-page.component';

import { HomePageContainerComponent } from './home-page.container';
import { homePageRoutes } from './home-page.routes';

@NgModule({
  imports: [CMSSharedModule, RouterModule.forChild(homePageRoutes), SharedModule],
  declarations: [HomePageComponent, HomePageContainerComponent],
})
export class HomePageModule {}
