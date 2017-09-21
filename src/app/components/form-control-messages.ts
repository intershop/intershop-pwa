import * as _ from 'lodash';
import { TranslateService } from "@ngx-translate/core";
import { Component, Input, ContentChild, HostBinding, ViewContainerRef, ComponentFactoryResolver, Directive, Output, EventEmitter, HostListener } from "@angular/core";
import { FormControlName, FormGroup } from "@angular/forms";
@Component({
    selector: 'is-control-messages',
    template: `<i class="form-control-feedback glyphicon" [ngClass]="{'glyphicon-remove':formControl.invalid,'glyphicon-ok':formControl.valid}"></i>
               <small *ngFor="let error of messagesList" class="help-block">{{error}}</small>`,
})
export class FormControlMessages {
    @Input() messagesList: string[];
    @Input() formControl: FormControlName;
}

@Component({
    selector: '.form-group',
    template: `
      <ng-content></ng-content>
    `
})
export class FormGroupComponent {
    @ContentChild(FormControlName) formControlNames: FormControlName;
    @HostBinding('class.has-error') get hasErrors() {
        if (this.formControlNames && this.formControlNames.dirty) {
            this.loadComponentDynamically(this.getErrorList());
            return this.formControlNames.invalid;
        }
    };
    @HostBinding('class.has-success') get hasSuccess() {
        return this.formControlNames ? (this.formControlNames.valid && this.formControlNames.dirty) : false;
    };

    @ContentChild('dynamicError', { read: ViewContainerRef }) dynamicInsert: ViewContainerRef;
    @Input() mesage: object;

    constructor(private translate: TranslateService, private cfResolver: ComponentFactoryResolver) { }

    getErrorList() {
        return _.reduce(this.formControlNames.errors, (result, value, key) => {
            let localizedString = (this.mesage[key]) ? this.mesage[key] : this.formControlNames.errors["customError"];
            this.translate.get(localizedString).subscribe(data => {
                result.push(data);
            }).unsubscribe();
            return result;
        }, []);
    };
    loadComponentDynamically(errorList) {
        this.dynamicInsert.clear();
        let factory = this.cfResolver.resolveComponentFactory(FormControlMessages);
        let componentRef = this.dynamicInsert.createComponent(factory);
        (<FormControlMessages>componentRef.instance).messagesList = errorList;
        (<FormControlMessages>componentRef.instance).formControl = this.formControlNames;
        componentRef.changeDetectorRef.detectChanges();
    }
}



@Directive({
    selector: "form"
})
export class FormValidationDirective {

    @Input() formGroup: FormGroup;
    @Output() validSubmit = new EventEmitter<any>();

    @HostListener("submit") onSubmit() {
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