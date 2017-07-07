import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule, Http, JsonpModule } from '@angular/http';

// Imports for loading & configuring the in-memory web api
//import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
//import { InMemoryDataService }  from './services/in-memory-data.service';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule, routingComponents } from './approuting.module';
import { CacheService, CacheStoragesEnum } from 'ng2-cache/ng2-cache';

import { AppComponent } from './app.component';
import { FooterModule } from './shared/components/footer/footer.module'
import { HeaderModule } from './shared/components/header/header.module';
import { CacheCustomService, EncryptDecryptService, CompressDecompressService, JwtService, ApiService, AuthService, DataEmitterService } from "app/shared/services";
import { CategoryApiService } from "app/shared/components/categoryList/categoryListService/categoryList.service.api";
import { CategoryMockService } from "app/shared/components/categoryList/categoryListService/categoryList.service.mock";
import { CategoryService } from "app/shared/components/categoryList/categoryListService/categoryList.service";
import { ProductListService } from "app/pages/familyPage/familyPageList/productListService/ProductList.service";
import { ProductListMockService } from "app/pages/familyPage/familyPageList/productListService/ProductList.service.mock";
import { ProductListApiService } from "app/pages/familyPage/familyPageList/productListService/ProductList.service.api";




// AoT requires an exported function for factories
export function createTranslateLoader(http: Http) {
  return new TranslateHttpLoader(http, '/assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
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
    //InMemoryWebApiModule.forRoot(InMemoryDataService)
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
    ProductListService,
    ProductListMockService,
    ProductListApiService,
    CategoryApiService,
    CategoryMockService,
    CategoryService,
    CompressDecompressService,
    AuthService,
    ApiService,
    JwtService],
  bootstrap: [AppComponent]
})
export class AppModule { }
