import { Directive, ElementRef, Input, OnChanges, Renderer2, SimpleChanges } from '@angular/core';

/**
 * Directive to handle PayPal card field error display.
 * Toggles visibility of error messages and adds validation styling to labels.
 *
 * @example
 * <div id="my-label">Label</div>
 * <small [ishPaypalError]="hasError" ishPaypalErrorLabelId="my-label">Error message</small>
 */
@Directive({
  selector: '[ishPaypalError]',
})
export class PaypalErrorDirective implements OnChanges {
  /** When true, shows the error message and marks the label as invalid */
  @Input() ishPaypalError = false;

  /** ID of the associated label element to toggle validation-error class */
  @Input() ishPaypalErrorLabelId: string;

  constructor(private elementRef: ElementRef<HTMLElement>, private renderer: Renderer2) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.ishPaypalError) {
      this.updateErrorState(this.ishPaypalError);
    }
  }

  /**
   * Updates the error visibility and label styling based on error state.
   */
  private updateErrorState(showError: boolean): void {
    const errorElement = this.elementRef.nativeElement;
    const labelElement = this.ishPaypalErrorLabelId ? document.getElementById(this.ishPaypalErrorLabelId) : undefined;

    if (showError) {
      this.renderer.removeClass(errorElement, 'hide-validation-error');
      if (labelElement) {
        this.renderer.addClass(labelElement, 'validation-error');
      }
    } else {
      this.renderer.addClass(errorElement, 'hide-validation-error');
      if (labelElement) {
        this.renderer.removeClass(labelElement, 'validation-error');
      }
    }
  }
}
