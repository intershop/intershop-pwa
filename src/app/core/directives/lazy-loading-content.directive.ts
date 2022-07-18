import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[ishLazyLoadingContent]',
})
export class LazyLoadingContentDirective {
  constructor(public templateRef: TemplateRef<unknown>) {}
}
