import { APP_ID, NgModule, TransferState } from '@angular/core';
import { BrowserModule, provideClientHydration, withNoHttpTransferCache } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UrlSerializer } from '@angular/router';

import { COOKIE_CONSENT_VERSION } from 'ish-core/configurations/state-keys';
import { CoreModule } from 'ish-core/core.module';
import { PWAUrlSerializer } from 'ish-core/routing/pwa-url.serializer';
import { StateManagementModule } from 'ish-core/state-management.module';

import { environment } from '../environments/environment';

import { AppComponent } from './app.component';
import { CopilotExportsModule } from './extensions/copilot/exports/copilot-exports.module';
import { AppRoutingModule } from './pages/app-routing.module';
import { ShellModule } from './shell/shell.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    // Core modules - must be loaded synchronously
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    CopilotExportsModule,
    CoreModule,
    ShellModule,
    // Routing - includes all routes (app routes + extension routes + app-last routes)
    StateManagementModule,
    // Note: Extension routing modules and AppLastRoutingModule are now integrated into appRoutes
    // CompareStoreModule is loaded lazily via LAZY_FEATURE_MODULE
  ],
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
