import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { HomePageContainerComponent } from './home-page.container';
import { homePageRoutes } from './home-page.routes';

@NgModule({
  imports: [
    RouterModule.forChild(homePageRoutes),
    SharedModule
  ],
  declarations: [
    HomePageContainerComponent
  ]
})

export class HomePageModule { }
