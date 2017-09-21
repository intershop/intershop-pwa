import { Injectable } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";
import * as _ from 'lodash';
const ErrorCodeMapping = {
    'Err001': 'account.register.password.extrainfo.message'
};


@Injectable()
export class ErrorCodeMappingService {
    constructor(private translate: TranslateService) { }

    getErrorMapping(errorInfo: any): string {
        let errorMessage: string = "No Error Mapping";
        if (ErrorCodeMapping.hasOwnProperty(errorInfo.errorCode)) {
            const result = _.reduce(errorInfo.parameter, (result, value, key) => {
                result[key] = value;
                return result;
            }, {});
            this.translate.get(ErrorCodeMapping[errorInfo.errorCode], result).subscribe(data => {
                errorMessage = data;
            });
        }
        return errorMessage;
    }
}