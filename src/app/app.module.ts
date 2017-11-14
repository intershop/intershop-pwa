import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { Inject, NgModule, PLATFORM_ID } from '@angular/core';
import { JsonpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing.module';
import { AuthInterceptor } from './interceptors/auth-interceptor';
import { MockInterceptor } from './interceptors/mock-interceptor';
import { CoreModule } from './modules/core.module';
import { PageModule } from './pages/pages.module';
import { CurrentLocaleService } from './services/locale/current-locale.service';

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
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: MockInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor( @Inject(PLATFORM_ID) platformId, translateService: TranslateService, currentLocaleService: CurrentLocaleService) {
    environment.platformId = platformId;

    const currentLang = environment.locales[0];
    translateService.setDefaultLang(currentLang.lang);
    currentLocaleService.setLang(currentLang);
  }
}
