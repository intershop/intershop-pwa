import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { JsonpModule } from '@angular/http';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { CacheService, CacheStorageAbstract, CacheLocalStorage } from 'ng2-cache/ng2-cache';
import { FooterModule } from './shared/components/footer/footer.module'
import { HeaderModule } from './shared/components/header/header.module';
import { AppRoutingModule } from './app.routing.module';
import { AppComponent } from './app.component';
import { CacheCustomService } from './shared/services/cache/cache-custom.service';
import { DataEmitterService } from './shared/services/data-emitter.service';
import { EncryptDecryptService } from './shared/services/cache/encrypt-decrypt.service';
import { ApiService } from './shared/services/api.service';
import { JwtService } from './shared/services/jwt.service';
import { PageModule } from './pages/pages.module';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { translateFactory } from '../shared/lang-switcher/custom-translate-loader';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './shared/http-interceptors/auth-interceptor';
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
    FormsModule,
    FooterModule,
    HeaderModule,
    ReactiveFormsModule,
    PageModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: translateFactory,
        deps: [HttpClient]
      }
    }),
    BsDropdownModule.forRoot(),
    CarouselModule.forRoot(),
    CollapseModule.forRoot(),
    ModalModule.forRoot(),
    PopoverModule.forRoot()
  ],
  providers: [CacheCustomService,
    CacheService,
    { provide: CacheStorageAbstract, useClass: CacheLocalStorage },
    DataEmitterService,
    EncryptDecryptService,
    ApiService,
    JwtService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
