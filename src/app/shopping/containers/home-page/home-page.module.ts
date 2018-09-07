import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ContentSharedModule } from '../../../content/content-shared.module';
import { SharedModule } from '../../../shared/shared.module';
import { HomePageComponent } from '../../components/home/home-page/home-page.component';

import { HomePageContainerComponent } from './home-page.container';
import { homePageRoutes } from './home-page.routes';

@NgModule({
  imports: [RouterModule.forChild(homePageRoutes), SharedModule, ContentSharedModule],
  declarations: [HomePageComponent, HomePageContainerComponent],
})
export class HomePageModule {}
