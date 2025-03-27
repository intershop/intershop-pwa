import { Directive, ElementRef, HostListener } from '@angular/core';

/**
 * This directive can be used to add functionality on form submit events.
 * It has been used to focus the first invalid form element on submit.
 */
@Directive({
  selector: '[ishFormSubmit]',
})
export class FormSubmitDirective {
  constructor(private elementRef: ElementRef) {}

  @HostListener('submit')
  onFormSubmit() {
    const invalidElements = this.elementRef.nativeElement.querySelectorAll('.ng-invalid');
    if (invalidElements.length) {
      invalidElements[0].focus();
    }
  }
}
