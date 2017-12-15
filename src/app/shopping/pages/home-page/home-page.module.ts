import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { HomePageComponent } from './home-page.component';
import { homePageRoutes } from './home-page.routes';

@NgModule({
  imports: [
    RouterModule.forChild(homePageRoutes),
    SharedModule
  ],
  declarations: [
    HomePageComponent
  ]
})

export class HomePageModule { }
