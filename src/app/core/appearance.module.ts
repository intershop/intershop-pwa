import { NgModule } from '@angular/core';
import { NgbPopoverConfig } from '@ng-bootstrap/ng-bootstrap';
import { SWIPER_CONFIG, SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { ToastrModule } from 'ngx-toastr';

import { IconModule } from './icon.module';
import { ThemeService } from './utils/theme/theme.service';

const DEFAULT_SWIPER_CONFIG: SwiperConfigInterface = {
  direction: 'horizontal',
  keyboard: true,
  mousewheel: false,
  navigation: true,
  scrollbar: false,
};

@NgModule({
  imports: [
    IconModule,
    ToastrModule.forRoot({
      closeButton: true,
      timeOut: 3000,
      positionClass: 'toast-top-full-width', // toast-top-center
      preventDuplicates: true,
    }),
  ],
  providers: [{ provide: SWIPER_CONFIG, useValue: DEFAULT_SWIPER_CONFIG }],
})
export class AppearanceModule {
  constructor(popoverConfig: NgbPopoverConfig, themeService: ThemeService) {
    popoverConfig.placement = 'top';
    popoverConfig.triggers = 'hover';
    popoverConfig.container = 'body';

    themeService.init();
  }
}
