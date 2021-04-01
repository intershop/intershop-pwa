import { NgModule } from '@angular/core';
import { BrowserModule, TransferState } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UrlSerializer } from '@angular/router';

import { COOKIE_CONSENT_VERSION } from 'ish-core/configurations/state-keys';
import { CoreModule } from 'ish-core/core.module';
import { CustomUrlSerializer } from 'ish-core/utils/custom-url-serializer';

import { environment } from '../environments/environment';

import { AppComponent } from './app.component';
import { PunchoutRoutingModule } from './extensions/punchout/pages/punchout-routing.module';
import { QuickorderRoutingModule } from './extensions/quickorder/pages/quickorder-routing.module';
import { QuotingRoutingModule } from './extensions/quoting/pages/quoting-routing.module';
import { TactonRoutingModule } from './extensions/tacton/pages/tacton-routing.module';
import { AppLastRoutingModule } from './pages/app-last-routing.module';
import { AppRoutingModule } from './pages/app-routing.module';
import { ShellModule } from './shell/shell.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule.withServerTransition({ appId: 'intershop-pwa' }),
    BrowserAnimationsModule,
    CoreModule,
    ShellModule,
    AppRoutingModule,
    QuickorderRoutingModule,
    QuotingRoutingModule,
    PunchoutRoutingModule,
    TactonRoutingModule,
    AppLastRoutingModule,
  ],
  bootstrap: [AppComponent],
  providers: [{ provide: UrlSerializer, useClass: CustomUrlSerializer }],
})
export class AppModule {
  constructor(transferState: TransferState) {
    if (!transferState.hasKey<number>(COOKIE_CONSENT_VERSION)) {
      transferState.set(COOKIE_CONSENT_VERSION, environment.cookieConsentVersion);
    }
  }
}
