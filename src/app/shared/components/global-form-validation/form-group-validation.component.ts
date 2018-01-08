// NEEDS_WORK: needs review and evaluation
import {
    AfterViewInit,
    Component,
    ComponentFactoryResolver,
    ContentChild,
    HostBinding,
    Input,
    OnDestroy,
    ViewContainerRef
} from '@angular/core';
import { FormControlName } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs/Subscription';

import { FormControlErrorComponent } from './form-control-error.component';

@Component({
  selector: 'ish-form-group-validation',
  template: `<ng-content></ng-content>`
})

export class FormGroupValidationComponent implements AfterViewInit, OnDestroy {
  @ContentChild(FormControlName) formControlName: FormControlName;
  @ContentChild('dynamicError', { read: ViewContainerRef }) dynamicError: ViewContainerRef;
  @Input() errorMessages: object;
  subscription: Subscription;

  constructor(
    private translate: TranslateService,
    private cfResolver: ComponentFactoryResolver
  ) { }

  ngAfterViewInit() {
    this.subscription = this.formControlName.statusChanges
      .subscribe(() => this.showError(this.getErrorList()));
  }

  getErrorList() {
    const result = [];

    if (!this.formControlName.errors) {
      return result;
    }

    Object.keys(this.formControlName.errors).map((key) => {
      const localizedString = (this.errorMessages && key in this.errorMessages && this.errorMessages[key]) ? this.errorMessages[key] : this.formControlName.errors['customError'];
      if (localizedString) {
        this.translate.get(localizedString).subscribe(data => { result.push(data); }).unsubscribe();
      }
    });

    return result;
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

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
