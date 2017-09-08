import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class GlobalConfiguration {
  private accountSettings = {
    useSimpleAccount: false
  };
  /**
   * returns applicationSettings
   * @returns Observable
   */
  getApplicationSettings(): Observable<any> {
    return Observable.of(this.accountSettings);
  }
}
