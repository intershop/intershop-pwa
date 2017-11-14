import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { HomePageComponent } from './home-page.component';
import { HomePageRoute } from './home-page.routes';

@NgModule({
  imports: [
    RouterModule.forChild(HomePageRoute),
    CarouselModule
  ],
  declarations: [HomePageComponent]
})
export class HomePageModule { }
