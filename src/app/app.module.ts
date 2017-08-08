import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule, JsonpModule } from '@angular/http';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { FooterModule } from './shared/components/footer/footer.module'
import { HeaderModule } from './shared/components/header/header.module';
import { AppRoutingModule } from './app.routing.module';
import { PopoverModule } from 'ngx-bootstrap/popover';

import { CacheService, CacheStorageAbstract, CacheLocalStorage } from 'ng2-cache/ng2-cache';
import { AppComponent } from './app.component';
import { CacheCustomService } from './shared/services/cache/cache-custom.service';
import { DataEmitterService } from './shared/services/data-emitter.service';
import { EncryptDecryptService } from './shared/services/cache/encrypt-decrypt.service';
import { ApiService } from './shared/services/api.service';
import { JwtService } from './shared/services/jwt.service';
import { PageModule } from './pages/pages.module';
import { translateFactory } from '../shared/lang-switcher/custom-translate-loader';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule.withServerTransition({
      appId: 'proof-of-concept'
    }),
    HttpModule,
    HttpClientModule,
    JsonpModule,
    AppRoutingModule,
    FormsModule,
    FooterModule,
    HeaderModule,
    ReactiveFormsModule,
    PageModule,
    PopoverModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: translateFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [CacheCustomService,
    CacheService,
    { provide: CacheStorageAbstract, useClass: CacheLocalStorage },
    DataEmitterService,
    EncryptDecryptService,
    ApiService,
    JwtService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
