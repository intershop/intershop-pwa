import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class GlobalConfiguration {
  private accountSettings = {
    useSimpleAccount: false,
    userRegistrationLoginType: 'email'
  };
  /**
   * returns applicationSettings
   * @returns Observable
   */
  getApplicationSettings(): Observable<any> {
    return Observable.of(this.accountSettings);
  }
}
