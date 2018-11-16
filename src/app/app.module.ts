import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { CoreModule } from 'ish-core/core.module';
import { CheckoutModule } from 'ish-core/store/checkout/checkout.module';
import { ContentModule } from 'ish-core/store/content/content.module';
import { ShoppingModule } from 'ish-core/store/shopping/shopping.module';

import { AccountModule } from './account/account.module';
import { AppNotFoundRoutingModule } from './app-not-found-routing.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './pages/app-routing.module';
import { QuotingModule } from './quoting/quoting.module';
import { RegistrationModule } from './registration/registration.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule.withServerTransition({
      appId: 'intershop-pwa',
    }),
    CoreModule,
    AppRoutingModule,
    // import the feature modules that provide the application functionalities
    ShoppingModule,
    ContentModule,
    CheckoutModule,
    RegistrationModule,
    AccountModule,
    QuotingModule,
    AppNotFoundRoutingModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
