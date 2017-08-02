import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomePageComponent } from './home-page.component';
import { RouterModule } from '@angular/router';
import { homePageRoute } from './home-page.routes';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(homePageRoute),
  ],
  declarations: [HomePageComponent]
})
export class HomePageModule { }
