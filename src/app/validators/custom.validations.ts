import { zipValidate } from "./zipcode.validator";
import { emailValidate } from './email.validator';
import { passwordValidate } from "./password.validator";
import { mismatchedValidation } from "./match-words.validator";
export const CustomValidations = {
    zipValidate,
    emailValidate,
    passwordValidate,
    mismatchedValidation
}