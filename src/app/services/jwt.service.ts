import { Injectable, Inject } from '@angular/core';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';

@Injectable()
export class JwtService {

  constructor( @Inject(PLATFORM_ID) private platformId: Object) {
  }

  /**
   * Get Authentication token
   * @returns String
   */
  getToken(): string {
    if (isPlatformBrowser(this.platformId)) {
      return window.localStorage['jwtToken'];
    }
  }


  /**
   * Save Authentication token
   * @param  {string} token
   */
  saveToken(token: string) {
    if (isPlatformBrowser(this.platformId)) {
      window.localStorage['jwtToken'] = token;
    }
  }


  /**
   * Distroy Authentication token
   */
  destroyToken() {
    if (isPlatformBrowser(this.platformId)) {
      window.localStorage.removeItem('jwtToken');
    }
  }

}
