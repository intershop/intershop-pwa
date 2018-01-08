import { Directive, HostBinding, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Directive({
  selector: '[ishVisualizeErrors]'
})
export class FormVisualizeErrorsDirective {

  // tslint:disable-next-line:no-input-rename
  @Input('ishVisualizeErrors') control: AbstractControl;

  @HostBinding('class.has-error') get hasErrors() {
    return this.control.invalid && this.control.dirty;
  }

  @HostBinding('class.has-success') get hasSuccess() {
    return this.control.valid && this.control.dirty;
  }

}
