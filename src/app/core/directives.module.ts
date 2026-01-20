import { NgModule } from '@angular/core';

import { BrowserLazyViewDirective } from './directives/browser-lazy-view.directive';
import { ClickOutsideDirective } from './directives/click-outside.directive';
import { FocusOutsideDirective } from './directives/focus-outside.directive';
import { FormSubmitDirective } from './directives/form-submit.directive';
import { IdentityProviderCapabilityDirective } from './directives/identity-provider-capability.directive';
import { IntersectionObserverDirective } from './directives/intersection-observer.directive';
import { LazyLoadingContentDirective } from './directives/lazy-loading-content.directive';
import { ProductContextAccessDirective } from './directives/product-context-access.directive';
import { ProductContextDirective } from './directives/product-context.directive';
import { ScrollDirective } from './directives/scroll.directive';
import { ServerHtmlDirective } from './directives/server-html.directive';

const declaredDirectives = [ClickOutsideDirective, FocusOutsideDirective, IntersectionObserverDirective];

const standaloneDirectives = [
  BrowserLazyViewDirective,
  ProductContextAccessDirective,
  ProductContextDirective,
  ServerHtmlDirective,
  ScrollDirective,
  LazyLoadingContentDirective,
  IdentityProviderCapabilityDirective,
  FormSubmitDirective,
];

@NgModule({
  declarations: declaredDirectives,
  imports: standaloneDirectives,
  exports: [...declaredDirectives, ...standaloneDirectives],
})
export class DirectivesModule {}
