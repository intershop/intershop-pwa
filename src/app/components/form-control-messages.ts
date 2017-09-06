import { Component, Input, Injectable } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import * as _ from 'lodash';
import { TranslateService } from "@ngx-translate/core";
import { Observable } from "rxjs/Observable";

@Injectable()
export class ValidationService {

    constructor(private translate: TranslateService) {

    }
    getValidatorErrorMessage(validatorName: string, customMesage?: object): string {
        let errorList = ['required', 'minlength', 'validateEmail'];
        let translatedMessage: string;
        if (_.find(errorList, err => err === validatorName)) {
            this.translate.get(customMesage[validatorName]).subscribe(data => {
                translatedMessage = data;
            }).unsubscribe();
        }
        return translatedMessage;
    }
}

@Component({
    selector: 'is-control-messages',
    template: `<small class="help-block" *ngIf="errorMessage !== null">{{errorMessage}}</small>`,
    providers: [ValidationService]
})
export class FormControlMessages {
    @Input() control: FormControl;
    @Input() mesage: object;

    constructor(private validationService: ValidationService) {

    }
    get errorMessage(): string {
        for (let propertyName in this.control.errors) {
            if (this.control.errors.hasOwnProperty(propertyName) && this.control.dirty) {
                return this.validationService.getValidatorErrorMessage(propertyName, this.mesage);
            }
        }
        return null;
    }
}

