import { Injectable } from '@angular/core';

@Injectable()
export class GlobalConfiguration {
  private accountSettings = {
    useSimpleAccount: false,
    userRegistrationLoginType: 'email',
    emailOptIn: true           // newsletter question on credentials form?
  };
  /**
   * returns applicationSettings
   * @returns Observable
   */
  getApplicationSettings(): any {
    return this.accountSettings;
  }
}
