import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, PLATFORM_ID, ViewChild } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { CookieLawContainerComponent } from 'angular2-cookie-law';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

import { getDeviceType, getWrapperClass, isStickyHeader } from 'ish-core/store/viewconf';

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
// tslint:disable-next-line:ccp-no-intelligence-in-components
export class AppComponent {
  @ViewChild('cookieLaw')
  private cookieLaw: CookieLawContainerComponent;
  isBrowser: boolean;

  wrapperClasses$ = combineLatest([
    this.store.pipe(select(getWrapperClass)),
    this.store.pipe(
      select(isStickyHeader),
      map(isSticky => (isSticky ? 'sticky-header' : ''))
    ),
    this.store.pipe(
      select(getDeviceType),
      map(deviceType => (deviceType === 'mobile' ? 'sticky-header' : ''))
    ),
  ]).pipe(map(classes => classes.filter(c => !!c)));

  deviceType$ = this.store.pipe(select(getDeviceType));

  constructor(private store: Store<{}>, @Inject(PLATFORM_ID) platformId: string) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  dismiss() {
    this.cookieLaw.dismiss();
  }
}
