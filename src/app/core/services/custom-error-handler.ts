// NEEDS_WORK: a general error handling needs to be established
import { ErrorHandler, Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class CustomErrorHandler extends ErrorHandler {

  /**
   * handle error
   * @param  {any} error
   */
  public handleError(error: any) {
    console.log(error.message);

  }

  /**
   * Handle api errors
   * @param  {any} error
   * @returns Observable
   */
  public handleApiErrors(error: any): Observable<any> {
    const errorMessage = error.status + ' and ' + error.statusText;
    console.log(errorMessage);
    return Observable.of(errorMessage);
  }
}
