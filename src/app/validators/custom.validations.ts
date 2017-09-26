import { emailValidate } from './email.validator';
import { mismatchedValidation } from './match-words.validator';
import { passwordValidate } from './password.validator';
import { zipValidate } from './zipcode.validator';
export const CustomValidations = {
    zipValidate,
    emailValidate,
    passwordValidate,
    mismatchedValidation
};
