import { CommonModule, CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { RecaptchaModule } from 'ng-recaptcha/recaptcha/recaptcha.module';
import { CustomFormsModule } from 'ng2-validation';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PopoverConfig, PopoverModule } from 'ngx-bootstrap/popover';
import { PipesModule } from '../shared/pipes.module';
import { PricePipe } from '../shared/pipes/price.pipe';
import { StyleWrapperDirective } from './directives/style-wrapper.directive';
import { FooterModule } from './footer.module';
import { HeaderModule } from './header.module';
import { ApiService } from './services/api.service';
import { ApiServiceErrorHandler } from './services/api.service.errorhandler';
import { CountryService } from './services/countries/country.service';
import { RegionService } from './services/countries/region.service';
import { CrosstabService } from './services/crosstab/crosstab.service';
import { translateFactory } from './services/custom-translate-loader';
import { StatePropertiesService } from './services/state-transfer/state-properties.service';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: translateFactory,
        deps: [HttpClient],
      },
    }),
    CustomFormsModule,
    RecaptchaModule.forRoot(),
    BsDropdownModule.forRoot(),
    CarouselModule.forRoot(),
    CollapseModule.forRoot(),
    ModalModule.forRoot(),
    PopoverModule.forRoot(),
    HeaderModule,
    FooterModule,
    PipesModule,
  ],
  declarations: [StyleWrapperDirective],
  providers: [
    ApiService,
    ApiServiceErrorHandler,
    StatePropertiesService,
    CountryService,
    RegionService,
    CrosstabService,
    CurrencyPipe, // TODO: https://github.com/angular/angular/issues/20536
    DatePipe,
    DecimalPipe,
    PricePipe,
  ],
  exports: [StyleWrapperDirective, HeaderModule, FooterModule],
})
export class CoreModule {
  constructor(
    @Optional()
    @SkipSelf()
    parentModule: CoreModule,
    popoverConfig: PopoverConfig,
    crosstabService: CrosstabService
  ) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import it in the AppModule only');
    }
    popoverConfig.placement = 'top';
    popoverConfig.triggers = 'hover';
    popoverConfig.container = 'body';

    crosstabService.listen();
  }
}
