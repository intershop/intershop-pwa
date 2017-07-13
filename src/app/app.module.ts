import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule, Http, JsonpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { CacheService, CacheStoragesEnum } from 'ng2-cache/ng2-cache';

import { FooterModule } from './shared/components/footer/footer.module'
import { HeaderModule } from './shared/components/header/header.module';
import { AppRoutingModule, routingComponents } from './approuting.module';

import {
  CacheCustomService, EncryptDecryptService, CompressDecompressService,
  JwtService, ApiService, DataEmitterService, InstanceService
} from "app/shared/services";
import { CategoryApiService } from "app/shared/components/categoryList/categoryListService/categoryList.service.api";
import { CategoryMockService } from "app/shared/components/categoryList/categoryListService/categoryList.service.mock";
import { CategoryService } from "app/shared/components/categoryList/categoryListService/categoryList.service";

import { AppComponent } from './app.component';


// AoT requires an exported function for factories
export function createTranslateLoader(http: Http) {
  return new TranslateHttpLoader(http, '/assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    JsonpModule,
    AppRoutingModule,
    FormsModule,
    FooterModule,
    HeaderModule,
    ReactiveFormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [Http]
      }
    })

  ],
  providers: [CacheCustomService,
    CacheService,
    DataEmitterService,
    EncryptDecryptService,
    CategoryApiService,
    CategoryMockService,
    CategoryService,
    CompressDecompressService,
    ApiService,
    InstanceService,
    JwtService
    ],
  bootstrap: [AppComponent]
})
export class AppModule { }
