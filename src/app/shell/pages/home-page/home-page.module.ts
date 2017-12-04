import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { HomePageComponent } from './home-page.component';
import { HomePageRoute } from './home-page.routes';

@NgModule({
  imports: [
    RouterModule.forChild(HomePageRoute),
    SharedModule
  ],
  declarations: [HomePageComponent]
})
export class HomePageModule { }
