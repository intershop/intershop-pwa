import { HttpParams } from '@angular/common/http';
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
   * Gets the list of punchout users.
   * @returns    An array of punchout users.
   */
  getUsers(): Observable<PunchoutUser[]> {
    return this.currentCustomer$.pipe(
      switchMap(customer =>
        this.apiService.get(`customers/${customer.customerNo}/punchouts/oci/users`).pipe(
          unpackEnvelope<Link>(),
          this.apiService.resolveLinks<PunchoutUser>(),
          map(users => users.map(user => ({ ...user, password: undefined })))
        )
      )
    );
  }

  /**
   * Creates a punchout user.
   * @param user    The punchout user.
   * @returns       The created punchout user.
   */
  createUser(user: PunchoutUser): Observable<PunchoutUser> {
    if (!user) {
      return throwError('createUser() of the punchout service called without punchout user');
    }

    return this.currentCustomer$.pipe(
      switchMap(customer =>
        this.apiService.post(`customers/${customer.customerNo}/punchouts/oci/users`, user).pipe(
          this.apiService.resolveLink<PunchoutUser>(),
          map(updatedUser => ({ ...updatedUser, password: undefined }))
        )
      )
    );
  }

  /**
   * Updates a punchout user.
   * @param user    The punchout user.
   * @returns       The updated punchout user.
   */
  updateUser(user: PunchoutUser): Observable<PunchoutUser> {
    if (!user) {
      return throwError('updateUser() of the punchout service called without punchout user');
    }

    return this.currentCustomer$.pipe(
      switchMap(customer =>
        this.apiService
          .put<PunchoutUser>(`customers/${customer.customerNo}/punchouts/oci/users/${user.login}`, user)
          .pipe(map(updatedUser => ({ ...updatedUser, password: undefined })))
      )
    );
  }

  /**
   * Deletes an oci punchout user.
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
  // !! ToDo: tests are missing !!

  /**
   * Gets the json object for the oci punchout.
   * @param basketId   The basket id for the punchout.
   */
  getBasketPunchoutData(basketId: string): Observable<Attribute<string>[]> {
    if (!basketId) {
      return throwError('getBasketPunchoutData() of the punchout service called without basketId');
    }

    return this.currentCustomer$.pipe(
      switchMap(customer =>
        this.apiService
          .post<{ data: Attribute<string>[] }>(`customers/${customer.customerNo}/punchouts/oci/transfer`, undefined, {
            params: new HttpParams().set('basketId', basketId),
          })
          .pipe(map(data => data.data))
      )
    );
  }

  /**
   * TODO: Gets the json object for the oci punchout.
   * @param productSKU   The basket id for the punchout.
   * @param quantity   The basket id for the punchout.
   */
  getProductPunchoutData(productSKU: string, quantity = 1): Observable<Attribute<string>[]> {
    if (!productSKU) {
      return throwError('getProductPunchoutData() of the punchout service called without productSKU');
    }

    return this.currentCustomer$.pipe(
      switchMap(() =>
        this.apiService
          .get<{ data: Attribute<string>[] }>(`punchouts/oci/validate`, {
            params: new HttpParams().set('productSKU', productSKU).set('quantity', quantity.toString()),
          })
          // .get<{ data: Attribute<string>[] }>(`customers/${customer.customerNo}/punchouts/oci/validate`, {
          //   params: new HttpParams().set('productSKU', productSKU).set('quantity', quantity.toString()),
          // })
          .pipe(map(data => data.data))
      )
    );
  }

  /**
   * TODO: Gets the json object for the oci punchout.
   * @param searchString   The basket id for the punchout.
   */
  getSearchPunchoutData(searchString: string): Observable<Attribute<string>[]> {
    if (!searchString) {
      return throwError('getSearchPunchoutData() of the punchout service called without searchString');
    }

    return this.currentCustomer$.pipe(
      switchMap(() =>
        this.apiService
          .get<{ data: Attribute<string>[] }>(`punchouts/oci/search`, {
            params: new HttpParams().set('searchString', searchString),
          })
          // .get<{ data: Attribute<string>[] }>(`customers/${customer.customerNo}/punchouts/oci/search`, {
          //   params: new HttpParams().set('searchString', searchString),
          // })
          .pipe(map(data => data.data))
      )
    );
  }

  /**
   * TODO: Gets the json object for the oci punchout.
   */
  submitPunchoutData(data: Attribute<string>[], submit = true) {
    const hookUrl = this.cookiesService.get('hookURL');
    // TODO: check HOOK_URL format (with or whithout http)
    if (!hookUrl) {
      return throwError('no HOOK_URL available in cookies to sendOciPunchoutData()');
    }
    if (!data || !data.length) {
      return throwError('sendOciPunchoutData() of the punchout service called without data');
    }

    // create a form and send it to the hook Url
    const ociform = this.createOciForm(hookUrl, data);
    document.body.innerHTML = '';
    document.body.appendChild(ociform);
    if (submit) {
      ociform.submit();
    }
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
