import { Component, ComponentFactoryResolver, ContentChild, HostBinding, Input, ViewContainerRef } from '@angular/core';
import { FormControlName } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';
import { FormControlErrorComponent } from './form-control-error.component';

@Component({
  selector: 'is-form-group-validation',
  template: `<ng-content></ng-content>`
})

export class FormGroupValidationComponent {
  @ContentChild(FormControlName) formControlName: FormControlName;
  @HostBinding('class.has-error') get hasErrors() {
    if (this.formControlName && this.formControlName.dirty) {
      this.showError(this.getErrorList());
      return this.formControlName.invalid;
    }
  }
  @HostBinding('class.has-success') get hasSuccess() {
    return this.formControlName ? (this.formControlName.valid && this.formControlName.dirty) : false;
  }

  @ContentChild('dynamicError', { read: ViewContainerRef }) dynamicError: ViewContainerRef;
  @Input() errorMessages: object;

  constructor(
    private translate: TranslateService,
    private cfResolver: ComponentFactoryResolver
  ) { }

  getErrorList() {
    return _.reduce(this.formControlName.errors, (result, value, key) => {
      const localizedString = (this.errorMessages && key in this.errorMessages && this.errorMessages[key]) ? this.errorMessages[key] : this.formControlName.errors['customError'];
      if (localizedString) {
        this.translate.get(localizedString).subscribe(data => {
          result.push(data);
        }).unsubscribe();
      }
      return result;
    }, []);
  }
  showError(errorList) {
    if (this.dynamicError) {
      this.dynamicError.clear();
      const factory = this.cfResolver.resolveComponentFactory(FormControlErrorComponent);
      const componentRef = this.dynamicError.createComponent(factory);
      const formControlMessages: FormControlErrorComponent = componentRef.instance;
      formControlMessages.messagesList = errorList;
      formControlMessages.formControl = this.formControlName;
      componentRef.changeDetectorRef.detectChanges();
    }
  }
}
