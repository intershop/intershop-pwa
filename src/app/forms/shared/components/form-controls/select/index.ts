/* tslint:disable:no-barrel-files */
export { SelectOption } from './select-option.interface';

import { SelectAddressComponent } from './select-address/select-address.component';
import { SelectCountryComponent } from './select-country/select-country.component';
import { SelectLanguageComponent } from './select-language/select-language.component';
import { SelectRegionComponent } from './select-region/select-region.component';
import { SelectSecurityQuestionComponent } from './select-security-question/select-security-question.component';
import { SelectTitleComponent } from './select-title/select-title.component';
import { SelectComponent } from './select.component';

export const selectComponents = [
  SelectAddressComponent,
  SelectCountryComponent,
  SelectLanguageComponent,
  SelectRegionComponent,
  SelectSecurityQuestionComponent,
  SelectTitleComponent,
  SelectComponent,
];
