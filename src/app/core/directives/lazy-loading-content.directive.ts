import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[ishLazyLoadingContent]',
  standalone: true,
})
export class LazyLoadingContentDirective {
  constructor(public templateRef: TemplateRef<unknown>) {}
}
