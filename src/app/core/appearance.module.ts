import { NgModule } from '@angular/core';
import { NgbPopoverConfig } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';

import { ThemeService } from './utils/theme/theme.service';

@NgModule({
  imports: [
    ToastrModule.forRoot({
      closeButton: true,
      timeOut: 3000,
      positionClass: 'toast-top-full-width', // toast-top-center
      preventDuplicates: true,
    }),
  ],
})
export class AppearanceModule {
  constructor(popoverConfig: NgbPopoverConfig, themeService: ThemeService) {
    popoverConfig.placement = 'top';
    popoverConfig.triggers = 'click';
    popoverConfig.autoClose = 'outside';
    popoverConfig.container = 'body';

    themeService.init();
  }
}
