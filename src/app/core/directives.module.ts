import { NgModule } from '@angular/core';

import { ClickOutsideDirective } from './directives/click-outside.directive';
import { IdentityProviderCapabilityDirective } from './directives/identity-provider-capability.directive';
import { IntersectionObserverDirective } from './directives/intersection-observer.directive';
import { ProductContextDirective } from './directives/product-context.directive';
import { ServerHtmlDirective } from './directives/server-html.directive';

@NgModule({
  declarations: [
    ClickOutsideDirective,
    IdentityProviderCapabilityDirective,
    IntersectionObserverDirective,
    ProductContextDirective,
    ServerHtmlDirective,
  ],
  exports: [
    ClickOutsideDirective,
    IdentityProviderCapabilityDirective,
    IntersectionObserverDirective,
    ProductContextDirective,
    ServerHtmlDirective,
  ],
})
export class DirectivesModule {}
