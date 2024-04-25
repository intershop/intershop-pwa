import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { register as SwiperRegister } from 'swiper/element/bundle';

import { SwiperSlideDirective } from './swiper-slide.directive';
import { SwiperComponent } from './swiper.component';

@NgModule({
  imports: [CommonModule],
  declarations: [SwiperComponent, SwiperSlideDirective],
  exports: [SwiperComponent, SwiperSlideDirective],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SwiperModule {
  constructor() {
    SwiperRegister();
  }
}
