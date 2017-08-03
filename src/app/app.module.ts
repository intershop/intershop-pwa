import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule, Http, JsonpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { CacheService, CacheStorageAbstract, CacheLocalStorage } from 'ng2-cache/ng2-cache';

import { FooterModule } from './shared/components/footer/footer.module'
import { HeaderModule } from './shared/components/header/header.module';
import { AppRoutingModule } from './app.routing.module';

import { AppComponent } from './app.component';
import { CacheCustomService } from './shared/services/cache/cacheCustom.service';
import { DataEmitterService } from './shared/services/dataEmitter.service';
import { EncryptDecryptService } from './shared/services/cache/encryptDecrypt.service';
import { CompressDecompressService } from './shared/services/cache/compressDecompress.service';
import { ApiService } from './shared/services/api.service';
import { JwtService } from './shared/services/jwt.service';
import { PageModule } from './pages/pages.module';

import { CarouselModule } from 'ngx-bootstrap/carousel';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { PopoverModule } from 'ngx-bootstrap/popover';

// AoT requires an exported function for factories
export function createTranslateLoader(http: Http) {
  return new TranslateHttpLoader(http, '/assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule.withServerTransition({
      appId: 'proof-of-concept'
    }),
    HttpModule,
    JsonpModule,
    AppRoutingModule,
    FormsModule,
    FooterModule,
    HeaderModule,
    ReactiveFormsModule,
    PageModule,
    CarouselModule.forRoot(),
    CollapseModule.forRoot(),
    PopoverModule.forRoot()
  ],
  providers: [CacheCustomService,
    CacheService,
    { provide: CacheStorageAbstract, useClass: CacheLocalStorage },
    DataEmitterService,
    EncryptDecryptService,
    CompressDecompressService,
    ApiService,
    JwtService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
