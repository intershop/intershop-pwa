import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[ishLazyLoadingContent]',
  standalone: false,
})
export class LazyLoadingContentDirective {
  constructor(public templateRef: TemplateRef<unknown>) {}
}
