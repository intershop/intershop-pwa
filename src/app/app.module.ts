import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AccountModule } from './account/account.module';
import { AppNotFoundRoutingModule } from './app-not-found-routing.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CheckoutModule } from './checkout/checkout.module';
import { ContentModule } from './content/content.module';
import { CoreModule } from './core/core.module';
import { QuotingModule } from './quoting/quoting.module';
import { RegistrationModule } from './registration/registration.module';
import { ShoppingModule } from './shopping/shopping.module';

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
