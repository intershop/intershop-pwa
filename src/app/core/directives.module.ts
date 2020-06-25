import { NgModule } from '@angular/core';

import { ClickOutsideDirective } from './directives/click-outside.directive';
import { IntersectionObserverDirective } from './directives/intersection-observer.directive';
import { OrderApprovalDirective } from './directives/order-approval.directive';
import { ServerHtmlDirective } from './directives/server-html.directive';

@NgModule({
  declarations: [ClickOutsideDirective, IntersectionObserverDirective, OrderApprovalDirective, ServerHtmlDirective],
  exports: [ClickOutsideDirective, IntersectionObserverDirective, OrderApprovalDirective, ServerHtmlDirective],
})
export class DirectivesModule {}
