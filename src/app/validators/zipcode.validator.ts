import { AbstractControl, ValidatorFn } from '@angular/forms';
export function zipValidate(pattern: any): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
        if (!control.value) {
            return null;
        } else {
            return pattern.test(control.value) ? {
                zipValidate: true
            } : null;
        }
    }
}