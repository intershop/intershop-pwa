import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

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
      let parameters = {};
      if (errorInfo && errorInfo.parameter) {
        parameters = errorInfo.parameter.reduce((result, value, key) => {
          result[key] = value;
          return result;
        }, {});
      }
      this.translate.get(ERROR_CODE_MAPPING[errorInfo.errorCode], parameters).subscribe(data => {
        errorMessage = data;
      });
    }
    return errorMessage;
  }
}
