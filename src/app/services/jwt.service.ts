import { Injectable } from '@angular/core';

@Injectable()
export class JwtService {

  private token: string = null;

  constructor() {
  }

  /**
   * Get Authentication token
   * @returns String
   */
  getToken(): string {
    return this.token;
  }


  /**
   * Save Authentication token
   * @param  {string} token
   */
  saveToken(token: string) {
    this.token = token;
  }


  /**
   * Distroy Authentication token
   */
  destroyToken() {
    this.token = null;
  }

}
