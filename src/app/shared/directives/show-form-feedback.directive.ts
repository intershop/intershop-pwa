import { Directive, HostBinding, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Directive({
  selector: '[ishShowFormFeedback]'
})
export class ShowFormFeedbackDirective {

  // tslint:disable-next-line:no-input-rename
  @Input('ishShowFormFeedback') control: AbstractControl;

  @HostBinding('class.has-error') get hasErrors() {
    return this.control.invalid && this.control.dirty;
  }

  @HostBinding('class.has-success') get hasSuccess() {
    return this.control.valid && this.control.dirty;
  }

}
