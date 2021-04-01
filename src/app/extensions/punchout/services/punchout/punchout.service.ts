import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, iif, throwError } from 'rxjs';
import { concatMap, filter, map, switchMap, take } from 'rxjs/operators';

import { Attribute } from 'ish-core/models/attribute/attribute.model';
import { Link } from 'ish-core/models/link/link.model';
import { ApiService, unpackEnvelope } from 'ish-core/services/api/api.service';
import { getUserPermissions } from 'ish-core/store/customer/authorization';
import { getCurrentBasketId } from 'ish-core/store/customer/basket';
import { getLoggedInCustomer } from 'ish-core/store/customer/user';
import { CookiesService } from 'ish-core/utils/cookies/cookies.service';
import { whenTruthy } from 'ish-core/utils/operators';

import { PunchoutSession } from '../../models/punchout-session/punchout-session.model';
import { PunchoutType, PunchoutUser } from '../../models/punchout-user/punchout-user.model';

// tslint:disable: force-jsdoc-comments
@Injectable({ providedIn: 'root' })
export class PunchoutService {
  constructor(private apiService: ApiService, private cookiesService: CookiesService, private store: Store) {}

  private currentCustomer$ = this.store.pipe(select(getLoggedInCustomer), whenTruthy(), take(1));

  /**
   * http header for Punchout API v2
   */
  private punchoutHeaders = new HttpHeaders({
    Accept: 'application/vnd.intershop.punchout.v2+json',
  });

  private getResourceType(punchoutType: PunchoutType): string {
    return punchoutType === 'oci' ? 'oci5' : 'cxml1.2';
  }

  // PUNCHOUT USER MANAGEMENT

  /** Gets the list of punchout users.
   * @returns    An array of punchout users.
   */
  getUsers(): Observable<PunchoutUser[]> {
    return this.currentCustomer$.pipe(
      switchMap(customer =>
        this.apiService
          .get(`customers/${customer.customerNo}/punchouts/oci5/users`, { headers: this.punchoutHeaders })
          .pipe(
            unpackEnvelope<Link>(),
            this.apiService.resolveLinks<PunchoutUser>({ headers: this.punchoutHeaders }),
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
        this.apiService
          .post(`customers/${customer.customerNo}/punchouts/oci5/users`, user, {
            headers: this.punchoutHeaders,
          })
          .pipe(
            this.apiService.resolveLink<PunchoutUser>({ headers: this.punchoutHeaders }),
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
          .put<PunchoutUser>(`customers/${customer.customerNo}/punchouts/oci5/users/${user.login}`, user, {
            headers: this.punchoutHeaders,
          })
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
        this.apiService.delete<void>(`customers/${customer.customerNo}/punchouts/oci5/users/${login}`, {
          headers: this.punchoutHeaders,
        })
      )
    );
  }

  // PUNCHOUT SHOPPING FUNCTIONALITY

  /**
   * Initiates the punchout basket transfer depending on the user permission with the fitting punchout type (cXML or OCI).
   */
  transferPunchoutBasket() {
    return this.store.pipe(select(getUserPermissions)).pipe(
      whenTruthy(),
      switchMap(permissions =>
        iif(
          () => permissions.includes('APP_B2B_SEND_CXML_BASKET'),
          this.transferCxmlPunchoutBasket(),
          iif(() => permissions.includes('APP_B2B_SEND_OCI_BASKET'), this.transferOciPunchoutBasket())
        )
      )
    );
  }

  /**
   * Submits the punchout data via HTML form to the punchout system configured in the given form.
   * @param form     The prepared HTML form to submit the punchout data.
   * @param submit   Controls whether the HTML form is actually submitted (default) or not (only created in the document body).
   */
  private submitPunchoutForm(form: HTMLFormElement, submit = true) {
    if (!form) {
      return throwError('submitPunchoutForm() of the punchout service called without a form');
    }

    // replace the document content with the form and submit the form
    document.body.innerHTML = '';
    document.body.appendChild(form);
    if (submit) {
      form.submit();
    }
  }

  // cXML SPECIFIC PUNCHOUT SHOPPING FUNCTIONALITY

  /**
   * getCxmlPunchoutSession
   */
  getCxmlPunchoutSession(sid: string): Observable<PunchoutSession> {
    return this.currentCustomer$.pipe(
      switchMap(customer =>
        this.apiService.get<PunchoutSession>(
          `customers/${customer.customerNo}/punchouts/${this.getResourceType('cxml')}/sessions/${sid}`,
          {
            headers: this.punchoutHeaders,
          }
        )
      )
    );
  }

  /**
   * transferCxmlPunchoutBasket
   */
  private transferCxmlPunchoutBasket() {
    const punchoutSID = this.cookiesService.get('punchout_SID');
    if (!punchoutSID) {
      return throwError('no punchout_SID available in cookies for cXML punchout basket transfer');
    }
    const returnURL = this.cookiesService.get('punchout_ReturnURL');
    if (!returnURL) {
      return throwError('no punchout_ReturnURL available in cookies for cXML punchout basket transfer');
    }

    return this.currentCustomer$.pipe(
      switchMap(customer =>
        this.apiService
          .post<string>(
            `customers/${customer.customerNo}/punchouts/${this.getResourceType('cxml')}/transfer`,
            undefined,
            {
              headers: new HttpHeaders({ Accept: 'text/xml' }),
              params: new HttpParams().set('sid', punchoutSID),
              responseType: 'text',
            }
          )
          .pipe(map(data => this.submitPunchoutForm(this.createCxmlPunchoutForm(data, returnURL))))
      )
    );

    // TODO: cleanup punchout cookies?
  }

  /**
   * Creates an cXML punchout compatible form with the given BrowserFormPostURL
   * and a hidden input field that contains the cXML PunchOutOrderMessage.
   * @param   punchOutOrderMessage
   * @param   browserFormPostUrl
   * @returns The cXML punchout form
   */
  private createCxmlPunchoutForm(punchOutOrderMessage: string, browserFormPostUrl: string): HTMLFormElement {
    const cXmlForm = document.createElement('form');
    cXmlForm.method = 'post';
    cXmlForm.action = browserFormPostUrl;
    cXmlForm.enctype = 'application/x-www-form-urlencoded';
    const input = document.createElement('input'); // set the returnURL
    input.setAttribute('name', 'cXML-urlencoded');
    input.setAttribute('value', punchOutOrderMessage); // set the cXML value
    input.setAttribute('type', 'hidden');
    cXmlForm.appendChild(input);
    return cXmlForm;
  }

  // OCI PUNCHOUT SHOPPING FUNCTIONALITY

  private transferOciPunchoutBasket() {
    return this.store.pipe(
      select(getCurrentBasketId),
      filter(basketId => !!basketId),
      concatMap(basketId => this.getOciPunchoutBasketData(basketId).pipe(map(data => this.submitOciPunchoutData(data))))
    );
  }

  /**
   * Gets a JSON object with the necessary OCI punchout data for the basket transfer.
   * @param basketId   The basket id for the punchout.
   */
  private getOciPunchoutBasketData(basketId: string): Observable<Attribute<string>[]> {
    if (!basketId) {
      return throwError('getOciPunchoutBasketData() of the punchout service called without basketId');
    }

    return this.currentCustomer$.pipe(
      switchMap(customer =>
        this.apiService
          .post<{ data: Attribute<string>[] }>(
            `customers/${customer.customerNo}/punchouts/${this.getResourceType('oci')}/transfer`,
            undefined,
            {
              headers: this.punchoutHeaders,
              params: new HttpParams().set('basketId', basketId),
            }
          )
          .pipe(map(data => data.data))
      )
    );
  }

  /**
   * Gets a JSON object with the necessary OCI punchout data for the product validation.
   * @param productId   The product id (SKU) of the product to validate.
   * @param quantity     The quantity for the validation (default: '1').
   */
  getOciPunchoutProductData(productId: string, quantity = '1'): Observable<Attribute<string>[]> {
    if (!productId) {
      return throwError('getOciPunchoutProductData() of the punchout service called without productId');
    }

    return this.currentCustomer$.pipe(
      switchMap(customer =>
        this.apiService
          .get<{ data: Attribute<string>[] }>(
            `customers/${customer.customerNo}/punchouts/${this.getResourceType('oci')}/validate`,
            {
              headers: this.punchoutHeaders,
              params: new HttpParams().set('productId', productId).set('quantity', quantity),
            }
          )
          .pipe(map(data => data.data))
      )
    );
  }

  /**
   * Gets a JSON object with the necessary OCI punchout data for the background search.
   * @param searchString   The search string to search punchout products.
   */
  getOciPunchoutSearchData(searchString: string): Observable<Attribute<string>[]> {
    if (!searchString) {
      return throwError('getOciPunchoutSearchData() of the punchout service called without searchString');
    }

    return this.currentCustomer$.pipe(
      switchMap(customer =>
        this.apiService
          .get<{ data: Attribute<string>[] }>(
            `customers/${customer.customerNo}/punchouts/${this.getResourceType('oci')}/background-search`,
            {
              headers: this.punchoutHeaders,
              params: new HttpParams().set('searchString', searchString),
            }
          )
          .pipe(map(data => data.data))
      )
    );
  }

  /**
   * Submits the OCI punchout data via HTML form to the OCI punchout system configured in the HOOK_URL
   * @param data     The punchout data retrieved from ICM.
   * @param submit   Controls whether the HTML form is actually submitted (default) or not (only created in the document body).
   */
  submitOciPunchoutData(data: Attribute<string>[], submit = true) {
    if (!data || !data.length) {
      return throwError('submitOciPunchoutData() of the punchout service called without data');
    }
    const hookUrl = this.cookiesService.get('punchout_HookURL');
    if (!hookUrl) {
      return throwError('no punchout_HookURL available in cookies for OCI Punchout submitPunchoutData()');
    }
    this.submitPunchoutForm(this.createOciForm(data, hookUrl), submit);
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
