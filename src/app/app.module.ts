import { APP_ID, NgModule, TransferState } from '@angular/core';
import { BrowserModule, provideClientHydration, withNoHttpTransferCache } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UrlSerializer } from '@angular/router';

import { COOKIE_CONSENT_VERSION } from 'ish-core/configurations/state-keys';
import { CoreModule } from 'ish-core/core.module';
import { PWAUrlSerializer } from 'ish-core/routing/pwa-url.serializer';

import { environment } from '../environments/environment';

import { AppComponent } from './app.component';
import { CompareRoutingModule } from './extensions/compare/pages/compare-routing.module';
import { ContactUsRoutingModule } from './extensions/contact-us/pages/contact-us-routing.module';
import { CopilotModule } from './extensions/copilot/copilot.module';
import { PunchoutRoutingModule } from './extensions/punchout/pages/punchout-routing.module';
import { QuickorderRoutingModule } from './extensions/quickorder/pages/quickorder-routing.module';
import { QuotingRoutingModule } from './extensions/quoting/pages/quoting-routing.module';
import { RecentlyRoutingModule } from './extensions/recently/pages/recently-routing.module';
import { StoreLocatorRoutingModule } from './extensions/store-locator/pages/store-locator-routing.module';
import { TactonRoutingModule } from './extensions/tacton/pages/tacton-routing.module';
import { AppLastRoutingModule } from './pages/app-last-routing.module';
import { AppRoutingModule } from './pages/app-routing.module';
import { ShellModule } from './shell/shell.module';

@NgModule({
  declarations: [AppComponent],
  /* eslint-disable @angular-eslint/sort-ngmodule-metadata-arrays */
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CoreModule,
    ShellModule,
    AppRoutingModule,
    QuickorderRoutingModule,
    QuotingRoutingModule,
    PunchoutRoutingModule,
    TactonRoutingModule,
    StoreLocatorRoutingModule,
    RecentlyRoutingModule,
    CompareRoutingModule,
    ContactUsRoutingModule,
    CopilotModule,
    AppLastRoutingModule,
  ],
  /* eslint-enable @angular-eslint/sort-ngmodule-metadata-arrays */
  bootstrap: [AppComponent],
  providers: [
    { provide: UrlSerializer, useClass: PWAUrlSerializer },
    { provide: APP_ID, useValue: 'intershop-pwa' },
    provideClientHydration(withNoHttpTransferCache()),
  ],
})
export class AppModule {
  constructor(transferState: TransferState) {
    if (!transferState.hasKey<number>(COOKIE_CONSENT_VERSION)) {
      transferState.set(COOKIE_CONSENT_VERSION, environment.cookieConsentVersion);
    }
  }
}
