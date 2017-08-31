import { NgModule, Optional, SkipSelf, ModuleWithProviders } from '@angular/core';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { CacheService, CacheLocalStorage, CacheStorageAbstract } from 'ng2-cache/ng2-cache';
import {
  ApiService, JwtService, EncryptDecryptService,
  DataEmitterService, CacheCustomService, CustomErrorHandler, GlobalState, CrossTabCommunicator
} from '../services';

import { HeaderModule } from '../components/header/header.module';
import { FooterModule } from '../components/footer/footer.module';
import { translateFactory } from '../services/custom-translate-loader';
import { StyleWrapperDirective } from '../directives/style-wrapper.directive';



@NgModule({
  imports: [
    FooterModule,
    HeaderModule,
    BsDropdownModule.forRoot(),
    CarouselModule.forRoot(),
    CollapseModule.forRoot(),
    ModalModule.forRoot(),
    PopoverModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: translateFactory,
        deps: [HttpClient]
      }
    }),
  ],
  declarations: [
    StyleWrapperDirective
  ],
  providers: [
    ApiService,
    DataEmitterService,
    EncryptDecryptService,
    JwtService,
    CacheCustomService,
    CacheService,
    { provide: CacheStorageAbstract, useClass: CacheLocalStorage },
    CustomErrorHandler,
    GlobalState,
    CrossTabCommunicator
  ],
  exports: [
    FooterModule,
    HeaderModule,
    StyleWrapperDirective
  ]
})
export class CoreModule {

  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: CoreModule,
      providers: []
    };
  }

  constructor( @Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(
        'CoreModule is already loaded. Import it in the AppModule only');
    }
  }
}
