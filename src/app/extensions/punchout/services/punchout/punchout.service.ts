import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, of, throwError } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';

import { Attribute } from 'ish-core/models/attribute/attribute.model';
import { Link } from 'ish-core/models/link/link.model';
import { ApiService, unpackEnvelope } from 'ish-core/services/api/api.service';
import { getLoggedInCustomer } from 'ish-core/store/customer/user';
import { CookiesService } from 'ish-core/utils/cookies/cookies.service';
import { whenTruthy } from 'ish-core/utils/operators';

import { PunchoutUser } from '../../models/punchout-user/punchout-user.model';

@Injectable({ providedIn: 'root' })
export class PunchoutService {
  constructor(private apiService: ApiService, private cookiesService: CookiesService, private store: Store) {}

  private currentCustomer$ = this.store.pipe(select(getLoggedInCustomer), whenTruthy(), take(1));

  /**
   * Gets the list of oci punchout users.
   * @returns    An array of puchout users.
   */
  getUsers(): Observable<PunchoutUser[]> {
    return this.currentCustomer$.pipe(
      switchMap(customer =>
        this.apiService
          .get(`customers/${customer.customerNo}/punchouts/oci/users`)
          .pipe(unpackEnvelope<Link>(), this.apiService.resolveLinks<PunchoutUser>())
      )
    );
  }

  /**
   * Creates an oci punchout user (connection).
   * @param user    The punchout user.
   * @returns       The created punchout user.
   */
  createUser(user: PunchoutUser): Observable<PunchoutUser> {
    if (!user) {
      return throwError('createUser() of the punchout service called without punchout user');
    }

    return this.currentCustomer$.pipe(
      switchMap(customer =>
        this.apiService
          .post(`customers/${customer.customerNo}/punchouts/oci/users`, user)
          .pipe(this.apiService.resolveLink<PunchoutUser>())
      )
    );
  }

  /**
   * Deletes an oci punchout user (connection).
   * @param login   The login of the punchout user.
   */
  deleteUser(login: string): Observable<void> {
    if (!login) {
      return throwError('deleteUser() of the punchout service called without login');
    }

    return this.currentCustomer$.pipe(
      switchMap(customer =>
        this.apiService.delete<void>(`customers/${customer.customerNo}/punchouts/oci/users/${login}`)
      )
    );
  }

  // tslint:disable-next-line:force-jsdoc-comments
  // !! ToDo: this code is currently working with mock data and has to be adapted, tests are missing !!

  /**
   * Gets the json object for the oci punchout.
   * @param basketId   The basket id for the punchout.
   */
  getOciPunchoutData(basketId: string): Observable<Attribute<string>[]> {
    if (!basketId) {
      return throwError('getOciPunchoutData() of the punchout service called without basketId');
    }

    return this.apiService
      .get<{ data: Attribute<string>[] }>(`punchouts/oci/transfer`)
      .pipe(map(data => data.data));
  }

  /**
   * Gets the json object for the oci punchout.
   */
  submitOciPunchoutData(data: Attribute<string>[]) {
    const hookUrl = this.cookiesService.get('hookURL');
    if (!hookUrl) {
      return throwError('no HOOK_URL available in cookies to sendOciPunchoutData()');
    }
    if (!data || !data.length) {
      return throwError('sendOciPunchoutData() of the punchout service called without data');
    }

    // create a form and send it to the hook Url
    const ociform = this.createOciForm(hookUrl, data);
    document.body.appendChild(ociform);
    ociform.submit();

    return of();
  }

  /**
   * Creates a form with hidden input field that reflects the attributes of the basket items.
   * @param   hookUrl   The hook Url
   * @param   data      Attributes (key value pair) array
   * @returns             The create hidden input field
   */
  private createOciForm(hookUrl: string, data: Attribute<string>[]): HTMLFormElement {
    const ociform = document.createElement('form');
    ociform.method = 'POST';
    ociform.action = hookUrl;
    ociform.style.display = 'none';
    ociform.append('Content-Type', 'application/x-www-form-urlencoded');
    ociform.append('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8');

    data.forEach(e => ociform.appendChild(this.createHiddenInput(e)));

    return ociform;
  }

  /**
   * Creates a hidden input field for the ociform.
   * @param   inputData   Attribute (key value pair)
   * @returns             The create hidden input field
   */
  private createHiddenInput(inputData: Attribute<string>): HTMLInputElement {
    const input = document.createElement('input'); // prepare a new input DOM element
    input.setAttribute('name', inputData.name); // set the param name
    input.setAttribute('value', inputData.value); // set the value
    input.setAttribute('type', 'hidden'); // set the type, like "hidden" or other

    return input;
  }
}
