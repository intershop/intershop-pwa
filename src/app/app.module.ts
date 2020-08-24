import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { CoreModule } from 'ish-core/core.module';

import { AppComponent } from './app.component';
import { QuickorderRoutingModule } from './extensions/quickorder/pages/quickorder-routing.module';
import { Quoting2RoutingModule } from './extensions/quoting2/pages/quoting2-routing.module';
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
    TactonRoutingModule,
    Quoting2RoutingModule,
    AppLastRoutingModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
