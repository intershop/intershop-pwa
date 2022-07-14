import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[ishLazyContent]',
})
export class LazyContentDirective {
  constructor(public template: TemplateRef<unknown>) {}
}
