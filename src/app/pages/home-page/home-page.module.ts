import { NgModule } from '@angular/core';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { HomePageComponent } from './home-page.component';

@NgModule({
  imports: [
    CarouselModule
  ],
  declarations: [HomePageComponent]
})
export class HomePageModule { }
