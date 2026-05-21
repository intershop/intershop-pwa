import { Directive, ElementRef, HostListener } from '@angular/core';

/**
 * This directive can be used to add functionality on form submit events.
 * It focuses the first invalid native form element on submit.
 * Custom elements (hyphenated tag names like Angular components or Formly wrappers) are skipped.
 */
@Directive({
  selector: '[ishFormSubmit]',
  standalone: false,
})
export class FormSubmitDirective {
  constructor(private elementRef: ElementRef<HTMLElement>) {}

  @HostListener('submit')
  onFormSubmit() {
    const firstElement = Array.from(this.elementRef.nativeElement.querySelectorAll<HTMLElement>('.ng-invalid')).find(
      el => !el.tagName.includes('-') || el.tagName.toLowerCase() === 'ng-select'
    );
    if (firstElement) {
      if (firstElement.tagName.toLowerCase() === 'ng-select') {
        firstElement.querySelector<HTMLElement>('input')?.focus();
      } else {
        firstElement.focus();
      }
    }
  }
}
