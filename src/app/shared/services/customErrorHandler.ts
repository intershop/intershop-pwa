import {ErrorHandler} from '@angular/core';
import {Observable} from 'rxjs/Rx';

export class CustomErrorHandler extends ErrorHandler {
  constructor() {
    // The true paramter tells Angular to rethrow exceptions, so operations like 'bootstrap' will result in an error
    // when an error happens. If we do not rethrow, bootstrap will always succeed.
    super(true);
  }

  handleError(error) {
    // send the error to the server
    // delegate to the default handler
    console.log(error.message);

  }

  handleApiErros(error: any): Observable<any> {
    const errorMessage = error.status + ' and ' + error.statusText;
    console.log(errorMessage);
    return Observable.of(null);
  }
}
