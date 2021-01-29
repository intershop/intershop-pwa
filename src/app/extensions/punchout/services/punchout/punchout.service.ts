import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, throwError } from 'rxjs';
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
   * Deletes a punchout user.
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

  /**
   * Gets a JSON object with the necessary punchout data for the basket transfer.
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
   * Gets a JSON object with the necessary punchout data for the product validation.
   * @param productSKU   The product SKU of the product to validate.
   * @param quantity     The quantity for the validation.
   */
  getProductPunchoutData(productSKU: string, quantity: string): Observable<Attribute<string>[]> {
    if (!productSKU) {
      return throwError('getProductPunchoutData() of the punchout service called without productSKU');
    }

    return this.currentCustomer$.pipe(
      switchMap(customer =>
        this.apiService
          .get<{ data: Attribute<string>[] }>(`customers/${customer.customerNo}/punchouts/oci/validate`, {
            params: new HttpParams().set('productSKU', productSKU).set('quantity', quantity),
          })
          .pipe(map(data => data.data))
      )
    );
  }

  /**
   * Gets a JSON object with the necessary punchout data for the background search.
   * @param searchString   The search string to search punchout products.
   */
  getSearchPunchoutData(searchString: string): Observable<Attribute<string>[]> {
    if (!searchString) {
      return throwError('getSearchPunchoutData() of the punchout service called without searchString');
    }

    return this.currentCustomer$.pipe(
      switchMap(customer =>
        this.apiService
          .get<{ data: Attribute<string>[] }>(`customers/${customer.customerNo}/punchouts/oci/search`, {
            params: new HttpParams().set('searchString', searchString),
          })
          .pipe(map(data => data.data))
      )
    );
  }

  /**
   * Submits the punchout data via HTML form to the punchout system configured in the HOOK_URL
   * @param data     The punchout data retrieved from ICM.
   * @param submit   Controls whether the HTML form is actually submitted (default) or not (only created in the document body).
   */
  submitPunchoutData(data: Attribute<string>[], submit = true) {
    const hookUrl = this.cookiesService.get('hookURL');
    if (!hookUrl) {
      return throwError('no HOOK_URL available in cookies to submitPunchoutData()');
    }
    if (!data || !data.length) {
      return throwError('submitPunchoutData() of the punchout service called without data');
    }

    // create a form and send it to the hook URL
    const form = this.createOciForm(data, hookUrl);
    document.body.innerHTML = '';
    document.body.appendChild(form);
    if (submit) {
      form.submit();
    }
  }

  /**
   * Creates an OCI punchout compatible form with hidden input fields that reflect the attributes of the punchout data.
   * @param   data      Attributes (key value pair) array
   * @param   hookUrl   The hook URL
   * @returns           The OCI punchout form
   */
  private createOciForm(data: Attribute<string>[], hookUrl: string): HTMLFormElement {
    const ociForm = document.createElement('form');
    ociForm.method = 'post';
    ociForm.action = hookUrl;
    data.forEach(inputData => {
      const input = document.createElement('input'); // prepare a new input DOM element
      input.setAttribute('name', inputData.name); // set the param name
      input.setAttribute('value', inputData.value); // set the value
      input.setAttribute('type', 'hidden'); // set the type "hidden"
      ociForm.appendChild(input); // add the input to the OCI form
    });
    return ociForm;
  }
}
