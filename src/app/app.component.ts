// tslint:disable:ccp-no-intelligence-in-components
import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, PLATFORM_ID, ViewChild } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { CookieLawContainerComponent } from 'angular2-cookie-law';

import { getWrapperClass } from 'ish-core/store/viewconf';

/**
 * The App Component provides the application frame for the single page application.
 * In addition to the page structure (header, main section, footer)
 * it holds the global functionality to present a cookie acceptance banner.
 */
@Component({
  selector: 'ish-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  @ViewChild('cookieLaw')
  private cookieLaw: CookieLawContainerComponent;

  wrapperClass$ = this.store.pipe(select(getWrapperClass));
  isBrowser: boolean;

  constructor(private store: Store<{}>, @Inject(PLATFORM_ID) platformId: string) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  dismiss() {
    this.cookieLaw.dismiss();
  }
}
