import * as _ from 'lodash';
import { TranslateService } from "@ngx-translate/core";
import { FormControlName } from "@angular/forms";
import { Component, ContentChild, HostBinding, Input, ViewContainerRef, ComponentFactoryResolver } from "@angular/core";
import { FormControlErrorComponent } from "./form-control-error.component";

@Component({
    selector: '.form-group',
    template: `
      <ng-content></ng-content>
    `
})
export class FormGroupValidationComponent {
    @ContentChild(FormControlName) formControlName: FormControlName;
    @HostBinding('class.has-error') get hasErrors() {
        if (this.formControlName && this.formControlName.dirty) {
            this.showError(this.getErrorList());
            return this.formControlName.invalid;
        }
    };
    @HostBinding('class.has-success') get hasSuccess() {
        return this.formControlName ? (this.formControlName.valid && this.formControlName.dirty) : false;
    };

    @ContentChild('dynamicError', { read: ViewContainerRef }) dynamicError: ViewContainerRef;
    @Input() errorMessages: object;

    constructor(private translate: TranslateService, private cfResolver: ComponentFactoryResolver) { }

    getErrorList() {
        return _.reduce(this.formControlName.errors, (result, value, key) => {
            let localizedString = (this.errorMessages[key]) ? this.errorMessages[key] : this.formControlName.errors["customError"];
            this.translate.get(localizedString).subscribe(data => {
                result.push(data);
            }).unsubscribe();
            return result;
        }, []);
    };
    showError(errorList) {
        if (this.dynamicError) {
            this.dynamicError.clear();
            let factory = this.cfResolver.resolveComponentFactory(FormControlErrorComponent);
            let componentRef = this.dynamicError.createComponent(factory);
            let formControlMessages: FormControlErrorComponent = componentRef.instance;
            formControlMessages.messagesList = errorList;
            formControlMessages.formControl = this.formControlName;
            componentRef.changeDetectorRef.detectChanges();
        }
    }
}

