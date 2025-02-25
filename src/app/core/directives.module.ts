import { NgModule } from '@angular/core';

import { BrowserLazyViewDirective } from './directives/browser-lazy-view.directive';
import { ClickOutsideDirective } from './directives/click-outside.directive';
import { FocusOutsideDirective } from './directives/focus-outside.directive';
import { IdentityProviderCapabilityDirective } from './directives/identity-provider-capability.directive';
import { IntersectionObserverDirective } from './directives/intersection-observer.directive';
import { LazyLoadingContentDirective } from './directives/lazy-loading-content.directive';
import { ProductContextAccessDirective } from './directives/product-context-access.directive';
import { ProductContextDirective } from './directives/product-context.directive';
import { ScrollDirective } from './directives/scroll.directive';
import { ServerHtmlDirective } from './directives/server-html.directive';

@NgModule({
  declarations: [
    BrowserLazyViewDirective,
    ClickOutsideDirective,
    FocusOutsideDirective,
    IdentityProviderCapabilityDirective,
    IntersectionObserverDirective,
    LazyLoadingContentDirective,
    ProductContextAccessDirective,
    ProductContextDirective,
    ScrollDirective,
    ServerHtmlDirective,
  ],
  exports: [
    BrowserLazyViewDirective,
    ClickOutsideDirective,
    FocusOutsideDirective,
    IdentityProviderCapabilityDirective,
    IntersectionObserverDirective,
    LazyLoadingContentDirective,
    ProductContextAccessDirective,
    ProductContextDirective,
    ScrollDirective,
    ServerHtmlDirective,
  ],
})
export class DirectivesModule {}
