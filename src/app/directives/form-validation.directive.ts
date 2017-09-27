import { Directive, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Directive({
    selector: '[isFormValidation]'
})
export class FormValidationDirective {

  @Input() formGroup: FormGroup;
  @Output() validSubmit = new EventEmitter<any>();

  @HostListener('submit') onSubmit() {
    this.markAsDirty(this.formGroup);
    if (this.formGroup.valid) {
      this.validSubmit.emit(this.formGroup.value);
    }
  }

  markAsDirty(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      if (formGroup.controls[key] instanceof FormGroup) {
        this.markAsDirty(formGroup.controls[key] as FormGroup);
      } else {
        formGroup.controls[key].markAsDirty();
        formGroup.controls[key].updateValueAndValidity();
      }
    });
  }
}
