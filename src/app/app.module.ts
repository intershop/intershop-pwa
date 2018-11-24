import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { CoreModule } from 'ish-core/core.module';

import { AppComponent } from './app.component';
import { AppNotFoundRoutingModule } from './pages/app-not-found-routing.module';
import { AppRoutingModule } from './pages/app-routing.module';
import { QuotingModule } from './quoting/quoting.module';
import { ShellModule } from './shell/shell.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule.withServerTransition({
      appId: 'intershop-pwa',
    }),
    BrowserAnimationsModule,
    CoreModule,
    ShellModule,
    AppRoutingModule,
    // import the feature modules that provide the application functionalities
    QuotingModule,
    AppNotFoundRoutingModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
