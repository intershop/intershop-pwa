import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbCollapseModule, NgbDropdownModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { DeferLoadModule } from '@trademe/ng-defer-load';
import { ReactiveComponentLoaderModule } from '@wishtack/reactive-component-loader';

import { ClickOutsideDirective } from 'ish-core/directives/click-outside.directive';
import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { IconModule } from 'ish-core/icon.module';
import { PipesModule } from 'ish-core/pipes.module';

import { QuotingExportsModule } from '../extensions/quoting/exports/quoting-exports.module';

import { FooterComponent } from './footer/footer/footer.component';
import { HeaderCheckoutComponent } from './header/header-checkout/header-checkout.component';
import { HeaderDefaultComponent } from './header/header-default/header-default.component';
import { HeaderNavigationComponent } from './header/header-navigation/header-navigation.component';
import { HeaderSimpleComponent } from './header/header-simple/header-simple.component';
import { HeaderComponent } from './header/header/header.component';
import { LanguageSwitchComponent } from './header/language-switch/language-switch.component';
import { LazyLoginModalComponent } from './header/lazy-login-modal/lazy-login-modal.component';
import { LoginStatusComponent } from './header/login-status/login-status.component';
import { MiniBasketComponent } from './header/mini-basket/mini-basket.component';
import { ProductCompareStatusComponent } from './header/product-compare-status/product-compare-status.component';
import { ProductImageComponent } from './header/product-image/product-image.component';
import { SearchBoxComponent } from './header/search-box/search-box.component';
import { SubCategoryNavigationComponent } from './header/sub-category-navigation/sub-category-navigation.component';
import { UserInformationMobileComponent } from './header/user-information-mobile/user-information-mobile.component';

const exportedComponents = [
  FooterComponent,
  HeaderComponent,
  ProductImageComponent,
  SearchBoxComponent,
  ServerHtmlDirective,
];

@NgModule({
  imports: [
    CommonModule,
    DeferLoadModule,
    FeatureToggleModule,
    IconModule,
    NgbCollapseModule,
    NgbDropdownModule,
    NgbModalModule,
    PipesModule.forRoot(),
    QuotingExportsModule,
    ReactiveComponentLoaderModule.withModule({
      moduleId: 'ish-shared',
      loadChildren: '../shared/shared.module#SharedModule',
    }),
    RouterModule,
    TranslateModule,
  ],
  declarations: [
    ...exportedComponents,
    ClickOutsideDirective,
    HeaderCheckoutComponent,
    HeaderDefaultComponent,
    HeaderNavigationComponent,
    HeaderSimpleComponent,
    LanguageSwitchComponent,
    LazyLoginModalComponent,
    LoginStatusComponent,
    MiniBasketComponent,
    ProductCompareStatusComponent,
    SubCategoryNavigationComponent,
    UserInformationMobileComponent,
  ],
  exports: [...exportedComponents],
  entryComponents: [LazyLoginModalComponent],
})
export class ShellModule {}
