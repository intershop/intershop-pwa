// tslint:disable:ccp-no-intelligence-in-components
import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
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

  constructor(private store: Store<{}>) {}

  dismiss() {
    this.cookieLaw.dismiss();
  }
}
