import { Injectable } from '@angular/core';

@Injectable()
export class JwtService {

  /**
   * Get Authentication token
   * @returns String
   */
  getToken(): String {
    return window.localStorage['jwtToken'];
  }


  /**
   * Save Authentication token
   * @param  {String} token
   */
  saveToken(token: String) {
    window.localStorage['jwtToken'] = token;
  }


  /**
   * Distroy Authentication token
   */
  destroyToken() {
    window.localStorage.removeItem('jwtToken');
  }

}
