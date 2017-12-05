import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';

const ERROR_CODE_MAPPING = {
  'Err001': 'account.register.password.extrainfo.message'
};

@Injectable()
export class ErrorCodeMappingService {

  constructor(
    private translate: TranslateService
  ) { }

  getErrorMapping(errorInfo: any): string {
    let errorMessage = 'No Error Mapping';
    if (ERROR_CODE_MAPPING.hasOwnProperty(errorInfo.errorCode)) {
      const paramters = _.reduce(errorInfo.parameter, (result, value, key) => {
        result[key] = value;
        return result;
      }, {});
      this.translate.get(ERROR_CODE_MAPPING[errorInfo.errorCode], paramters).subscribe(data => {
        errorMessage = data;
      });
    }
    return errorMessage;
  }
}
