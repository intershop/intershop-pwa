import { NgModule } from '@angular/core';

import { ClickOutsideDirective } from './directives/click-outside.directive';
import { IntersectionObserverDirective } from './directives/intersection-observer.directive';
import { ServerHtmlDirective } from './directives/server-html.directive';

@NgModule({
  declarations: [ClickOutsideDirective, IntersectionObserverDirective, ServerHtmlDirective],
  exports: [ClickOutsideDirective, IntersectionObserverDirective, ServerHtmlDirective],
})
export class DirectivesModule {}
