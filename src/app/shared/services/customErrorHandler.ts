import {ErrorHandler} from '@angular/core';
import {Observable} from 'rxjs/Rx';

export class CustomErrorHandler extends ErrorHandler {

  
  /**
   * Constructor
   */
  constructor() {
    super(true);
  }

  
  /**
   * handle error
   * @param  {any} error
   */
  handleError(error:any) {
    console.log(error.message);

  }

  /**
   * Handle api errors
   * @param  {any} error
   * @returns Observable
   */
  handleApiErros(error: any): Observable<any> {
    const errorMessage = error.status + ' and ' + error.statusText;
    console.log(errorMessage);
    return Observable.of(null);
  }
}
