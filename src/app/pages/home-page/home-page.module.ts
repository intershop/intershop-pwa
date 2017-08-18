import { NgModule } from '@angular/core';
import { HomePageComponent } from './home-page.component';
import { RouterModule } from '@angular/router';
import { HomePageRoute } from './home-page.routes';
import { CarouselModule } from 'ngx-bootstrap/carousel';

@NgModule({
  imports: [
    RouterModule.forChild(HomePageRoute),
    CarouselModule
  ],
  declarations: [HomePageComponent]
})
export class HomePageModule { }
