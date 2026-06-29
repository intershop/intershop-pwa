import {
  EnvironmentProviders,
  importProvidersFrom,
  inject,
  makeEnvironmentProviders,
  provideEnvironmentInitializer,
} from '@angular/core';
import { NgbPopoverConfig } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';

import { ThemeService } from './utils/theme/theme.service';

function initializeAppearance() {
  const popoverConfig = inject(NgbPopoverConfig);
  const themeService = inject(ThemeService);

  popoverConfig.placement = 'top';
  popoverConfig.triggers = 'click';
  popoverConfig.autoClose = 'outside';
  popoverConfig.container = 'body';

  themeService.init();
}

export function provideAppearance(): EnvironmentProviders {
  return makeEnvironmentProviders([
    importProvidersFrom(
      ToastrModule.forRoot({
        closeButton: true,
        timeOut: 3000,
        positionClass: 'toast-top-full-width', // toast-top-center
        preventDuplicates: true,
      })
    ),
    provideEnvironmentInitializer(initializeAppearance),
  ]);
}
