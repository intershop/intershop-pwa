import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpModule, Http, JsonpModule} from '@angular/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

import {CacheService} from 'ng2-cache/ng2-cache';

import {FooterModule} from './shared/components/footer/footer.module'
import {HeaderModule} from './shared/components/header/header.module';
import {AppRoutingModule} from './approuting.module';


import {AppComponent} from './app.component';
import {CacheCustomService} from './shared/services/cache/cacheCustom.service';
import {DataEmitterService} from './shared/services/dataEmitter.service';
import {EncryptDecryptService} from './shared/services/cache/encryptDecrypt.service';
import {CompressDecompressService} from './shared/services/cache/compressDecompress.service';
import {AuthService} from './shared/services/auth.service';
import {ApiService} from './shared/services/api.service';
import {InstanceService} from './shared/services/instance.service';
import {JwtService} from './shared/services/jwt.service';
import {CategoryApiService} from './shared/components/categoryList/categoryListService/categoryList.service.api';
import {CategoryMockService} from './shared/components/categoryList/categoryListService/categoryList.service.mock';
import {CategoryService} from './shared/components/categoryList/categoryListService/categoryList.service';


// AoT requires an exported function for factories
export function createTranslateLoader(http: Http) {
  return new TranslateHttpLoader(http, '/assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
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
    /*TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [Http]
      }
    })*/

  ],
  providers: [CacheCustomService,
    CacheService,
    DataEmitterService,
    EncryptDecryptService,
    CategoryApiService,
    CategoryMockService,
    CategoryService,
    CompressDecompressService,
    AuthService,
    ApiService,
    InstanceService,
    JwtService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
