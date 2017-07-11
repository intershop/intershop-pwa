import { AbstractControl } from '@angular/forms';

export class PasswordValidator {
    public static validate(c: AbstractControl) {
        let PASSWORD_REGEXP = /(?!^[0-9]*$)(?!^[a-zA-Z]*$)^([a-zA-Z0-9!@#$%^&*()_+}{?><:"\S]{7,})$/;
        if (!c.value) {
            return null;
        } else {
            return PASSWORD_REGEXP.test(c.value) ? null : {
                validatePassword: {
                    valid: true
                }
            };
        }
    }
}
