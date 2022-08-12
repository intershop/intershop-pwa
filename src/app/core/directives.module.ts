import { NgModule } from '@angular/core';

import { ClickOutsideDirective } from './directives/click-outside.directive';
import { IdentityProviderCapabilityDirective } from './directives/identity-provider-capability.directive';
import { IntersectionObserverDirective } from './directives/intersection-observer.directive';
import { LazyLoadingContentDirective } from './directives/lazy-loading-content.directive';
import { ProductContextAccessDirective } from './directives/product-context-access.directive';
import { ProductContextDirective } from './directives/product-context.directive';
import { ScrollDirective } from './directives/scroll.directive';
import { ServerHtmlDirective } from './directives/server-html.directive';

@NgModule({
  declarations: [
    ClickOutsideDirective,
    IdentityProviderCapabilityDirective,
    IntersectionObserverDirective,
    LazyLoadingContentDirective,
    ProductContextAccessDirective,
    ProductContextDirective,
    ScrollDirective,
    ServerHtmlDirective,
  ],
  exports: [
    ClickOutsideDirective,
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
