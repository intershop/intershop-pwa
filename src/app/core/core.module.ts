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
  ApiService, InstanceService, JwtService, EncryptDecryptService,
  DataEmitterService, CacheCustomService, CustomErrorHandler, GlobalState
} from '../shared/services';

import { HeaderModule } from '../shared/components/header/header.module';
import { FooterModule } from '../shared/components/footer/footer.module';
import { translateFactory } from '../../shared/lang-switcher/custom-translate-loader';
import { StyleWrapperDirective } from '../shared/directives/style-wrapper.directive';



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
    GlobalState
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
