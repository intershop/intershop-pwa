import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { JsonpModule } from '@angular/http';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app.routing.module';
import { AppComponent } from './app.component';
import { PageModule } from './pages/pages.module';
import { CoreModule } from './core/core.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule.withServerTransition({
      appId: 'proof-of-concept'
    }),
    HttpClientModule,
    JsonpModule,
    AppRoutingModule,
    PageModule,
    CoreModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
