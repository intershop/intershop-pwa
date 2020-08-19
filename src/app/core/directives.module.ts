import { NgModule } from '@angular/core';

import { ClickOutsideDirective } from './directives/click-outside.directive';
import { ServerHtmlDirective } from './directives/server-html.directive';

@NgModule({
  declarations: [ClickOutsideDirective, ServerHtmlDirective],
  exports: [ClickOutsideDirective, ServerHtmlDirective],
})
export class DirectivesModule {}
