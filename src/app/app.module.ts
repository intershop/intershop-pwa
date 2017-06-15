import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpModule, Http} from '@angular/http';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header.component';
import { FooterComponent } from './footer.component';
import { FamilyPageComponent } from './pages/family-page.component';
import { ErrorPageComponent } from './pages/error-page.component';

// AoT requires an exported function for factories
export function createTranslateLoader(http: Http) {
    return new TranslateHttpLoader(http, '/assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    FamilyPageComponent,
    ErrorPageComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: (createTranslateLoader),
          deps: [Http]
        }
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
