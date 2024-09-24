import { DOCUMENT } from '@angular/common';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { EMPTY, Observable, iif, throwError } from 'rxjs';
import { concatMap, filter, map, switchMap, take } from 'rxjs/operators';

import { Attribute } from 'ish-core/models/attribute/attribute.model';
import { Link } from 'ish-core/models/link/link.model';
import { ApiService, unpackEnvelope } from 'ish-core/services/api/api.service';
import { getUserPermissions } from 'ish-core/store/customer/authorization';
import { getCurrentBasketId } from 'ish-core/store/customer/basket';
import { getLoggedInCustomer } from 'ish-core/store/customer/user';
import { CookiesService } from 'ish-core/utils/cookies/cookies.service';
import { DomService } from 'ish-core/utils/dom/dom.service';
import { whenTruthy } from 'ish-core/utils/operators';

import { CxmlConfigurationData } from '../../models/cxml-configuration/cxml-configuration.interface';
import { CxmlConfigurationMapper } from '../../models/cxml-configuration/cxml-configuration.mapper';
import { CxmlConfiguration } from '../../models/cxml-configuration/cxml-configuration.model';
import { OciConfigurationItem } from '../../models/oci-configuration-item/oci-configuration-item.model';
import { OciOptionsData } from '../../models/oci-options/oci-options.interface';
import { OciOptionsMapper } from '../../models/oci-options/oci-options.mapper';
import { OciOptions } from '../../models/oci-options/oci-options.model';
import { PunchoutSession } from '../../models/punchout-session/punchout-session.model';
import { PunchoutType, PunchoutUser } from '../../models/punchout-user/punchout-user.model';

@Injectable({ providedIn: 'root' })
export class PunchoutService {
  constructor(
    private apiService: ApiService,
    private cookiesService: CookiesService,
    private store: Store,
    private domService: DomService,
    @Inject(DOCUMENT) private document: Document
  ) {}

  private currentCustomer$ = this.store.pipe(select(getLoggedInCustomer), whenTruthy(), take(1));

  /**
   * http header for Punchout API v2
   */
  private punchoutHeaderV2 = new HttpHeaders({ Accept: 'application/vnd.intershop.punchout.v2+json' });

  /**
   * http header for cXML Punchout API v3
   */
  private punchoutHeaderV3 = new HttpHeaders({ Accept: 'application/vnd.intershop.punchout.cxml.v3+json' });

  private getResourceType(punchoutType: PunchoutType): string {
    return punchoutType === 'oci' ? 'oci5' : punchoutType === 'cxml' ? 'cxml1.2' : punchoutType;
  }

  /**
   * Gets all supported punchout formats.
   *
   * @returns    An array of punchout types.
   */
  getPunchoutTypes(): Observable<PunchoutType[]> {
    return this.currentCustomer$.pipe(
      switchMap(customer =>
        this.apiService
          .get(`customers/${this.apiService.encodeResourceId(customer.customerNo)}/punchouts`, {
            headers: this.punchoutHeaderV2,
          })
          .pipe(
            unpackEnvelope<Link>(),
            this.apiService.resolveLinks<{ punchoutType: PunchoutType; version: string }>({
              headers: this.punchoutHeaderV2,
            }),
            map(types => types?.map(type => type.punchoutType))
          )
      )
    );
  }

  // PUNCHOUT USER MANAGEMENT

  /**
   * Gets the list of punchout users.
   *
   * @param punchoutType    The user's punchout type.
   * @returns               An array of punchout users.
   */
  getUsers(punchoutType: PunchoutType): Observable<PunchoutUser[]> {
    if (!punchoutType) {
      return throwError(() => new Error('getUsers() of the punchout service called without punchout type'));
    }

    return this.currentCustomer$.pipe(
      switchMap(customer =>
        this.apiService
          .get(
            `customers/${this.apiService.encodeResourceId(customer.customerNo)}/punchouts/${this.getResourceType(
              punchoutType
            )}/users`,
            { headers: this.punchoutHeaderV2 }
          )
          .pipe(
            unpackEnvelope<Link>(),
            this.apiService.resolveLinks<PunchoutUser>({ headers: this.punchoutHeaderV2 }),
            map(users => users.map(user => ({ ...user, punchoutType, password: undefined })))
          )
      )
    );
  }

  /**
   * Creates a punchout user.
   *
   * @param user          The punchout user.
   * @returns             The created punchout user.
   */
  createUser(user: PunchoutUser): Observable<PunchoutUser> {
    if (!user) {
      return throwError(() => new Error('createUser() of the punchout service called without punchout user'));
    }

    return this.currentCustomer$.pipe(
      switchMap(customer =>
        this.apiService
          .post(
            `customers/${this.apiService.encodeResourceId(customer.customerNo)}/punchouts/${this.getResourceType(
              user.punchoutType
            )}/users`,
            user,
            { headers: this.punchoutHeaderV2 }
          )
          .pipe(
            this.apiService.resolveLink<PunchoutUser>({ headers: this.punchoutHeaderV2 }),
            map(createdUser => ({ ...createdUser, punchoutType: user.punchoutType, password: undefined }))
          )
      )
    );
  }

  /**
   * Updates a punchout user.
   *
   * @param user    The punchout user.
   * @returns       The updated punchout user.
   */
  updateUser(user: PunchoutUser): Observable<PunchoutUser> {
    if (!user) {
      return throwError(() => new Error('updateUser() of the punchout service called without punchout user'));
    }

    return this.currentCustomer$.pipe(
      switchMap(customer =>
        this.apiService
          .put<PunchoutUser>(
            `customers/${this.apiService.encodeResourceId(customer.customerNo)}/punchouts/${this.getResourceType(
              user.punchoutType
            )}/users/${this.apiService.encodeResourceId(user.login)}`,
            user,
            { headers: this.punchoutHeaderV2 }
          )
          .pipe(map(updatedUser => ({ ...updatedUser, punchoutType: user.punchoutType, password: undefined })))
      )
    );
  }

  /**
   * Deletes a punchout user.
   *
   * @param user    The punchout user.
   */
  deleteUser(user: PunchoutUser): Observable<void> {
    if (!user) {
      return throwError(() => new Error('deleteUser() of the punchout service called without user'));
    }

    return this.currentCustomer$.pipe(
      switchMap(customer =>
        this.apiService.delete<void>(
          `customers/${this.apiService.encodeResourceId(customer.customerNo)}/punchouts/${this.getResourceType(
            user.punchoutType
          )}/users/${this.apiService.encodeResourceId(user.login)}`,
          { headers: this.punchoutHeaderV2 }
        )
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
          iif(() => permissions.includes('APP_B2B_SEND_OCI_BASKET'), this.transferOciPunchoutBasket(), EMPTY)
        )
      )
    );
  }

  /**
   * Submits the punchout data via HTML form to the punchout system configured in the given form.
   *
   * @param form     The prepared HTML form to submit the punchout data.
   * @param submit   Controls whether the HTML form is actually submitted (default) or not (only created in the document body).
   */
  private submitPunchoutForm(form: HTMLFormElement, submit = true) {
    if (!form) {
      return throwError(() => new Error('submitPunchoutForm() of the punchout service called without a form'));
    }

    // replace the document content with the form and submit the form
    this.domService.setProperty(this.document.body, 'innerHTML', '');
    this.domService.appendChild(this.document.body, form);

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
          `customers/${this.apiService.encodeResourceId(customer.customerNo)}/punchouts/${this.getResourceType(
            'cxml'
          )}/sessions/${this.apiService.encodeResourceId(sid)}`,
          { headers: this.punchoutHeaderV2 }
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
      return throwError(() => new Error('no punchout_SID available in cookies for cXML punchout basket transfer'));
    }
    const returnURL = this.cookiesService.get('punchout_ReturnURL');
    if (!returnURL) {
      return throwError(
        () => new Error('no punchout_ReturnURL available in cookies for cXML punchout basket transfer')
      );
    }

    return this.currentCustomer$.pipe(
      switchMap(customer =>
        this.apiService
          .post<string>(
            `customers/${this.apiService.encodeResourceId(customer.customerNo)}/punchouts/${this.getResourceType(
              'cxml'
            )}/transfer`,
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
   *
   * @param   punchOutOrderMessage
   * @param   browserFormPostUrl
   * @returns The cXML punchout form
   */
  private createCxmlPunchoutForm(punchOutOrderMessage: string, browserFormPostUrl: string): HTMLFormElement {
    const cXmlForm = this.domService.createElement<HTMLFormElement>('form');
    this.domService.setProperty(cXmlForm, 'method', 'post');
    this.domService.setProperty(cXmlForm, 'action', browserFormPostUrl);
    this.domService.setProperty(cXmlForm, 'enctype', 'application/x-www-form-urlencoded');

    const input = this.domService.createElement('input', cXmlForm); // set the returnURL
    this.domService.setProperty(input, 'name', 'cXML-urlencoded');
    this.domService.setProperty(input, 'value', punchOutOrderMessage);
    this.domService.setProperty(input, 'type', 'hidden');

    return cXmlForm;
  }

  /**
   * Gets the cXML configuration for a given user.
   *
   * @param user    The punchout user id.
   * @returns       An array of punchout cXML configurations.
   */
  getCxmlConfiguration(userId: string): Observable<CxmlConfiguration[]> {
    return this.currentCustomer$.pipe(
      switchMap(customer =>
        this.apiService
          .get<CxmlConfigurationData>(
            `customers/${this.apiService.encodeResourceId(customer.customerNo)}/punchouts/${this.getResourceType(
              'cxml'
            )}/users/${this.apiService.encodeResourceId(userId)}/configurations`,
            { headers: this.punchoutHeaderV3 }
          )
          .pipe(map(CxmlConfigurationMapper.fromData))
      )
    );
  }

  /**
   *  Updates a punchout cxml configuration.
   *
   * @param cxmlConfiguration  An array of cxml configuration items to update.
   * @param user               The selected punchout user id.
   * @returns                  The updated cxml configuration.
   */
  updateCxmlConfiguration(cxmlConfiguration: CxmlConfiguration[], userId: string): Observable<CxmlConfiguration[]> {
    if (!cxmlConfiguration) {
      return throwError(() => new Error('updateCxmlConfiguration() called without required CxmlConfiguration'));
    }

    if (!userId) {
      return throwError(() => new Error('updateCxmlConfiguration() called without required userId'));
    }

    return this.currentCustomer$.pipe(
      switchMap(customer =>
        this.apiService
          .patch<CxmlConfigurationData>(
            `customers/${this.apiService.encodeResourceId(customer.customerNo)}/punchouts/${this.getResourceType(
              'cxml'
            )}/users/${this.apiService.encodeResourceId(userId)}/configurations`,
            cxmlConfiguration,
            { headers: this.punchoutHeaderV3 }
          )
          .pipe(map(CxmlConfigurationMapper.fromData))
      )
    );
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
   *
   * @param basketId   The basket id for the punchout.
   */
  private getOciPunchoutBasketData(basketId: string): Observable<Attribute<string>[]> {
    if (!basketId) {
      return throwError(() => new Error('getOciPunchoutBasketData() of the punchout service called without basketId'));
    }

    return this.currentCustomer$.pipe(
      switchMap(customer =>
        this.apiService
          .post<{ data: Attribute<string>[] }>(
            `customers/${this.apiService.encodeResourceId(customer.customerNo)}/punchouts/${this.getResourceType(
              'oci'
            )}/transfer`,
            undefined,
            {
              headers: this.punchoutHeaderV2,
              params: new HttpParams().set('basketId', basketId),
            }
          )
          .pipe(map(data => data.data))
      )
    );
  }

  /**
   * Gets a JSON object with the necessary OCI punchout data for the product validation.
   *
   * @param productId   The product id (SKU) of the product to validate.
   * @param quantity     The quantity for the validation (default: '1').
   */
  getOciPunchoutProductData(productId: string, quantity = '1'): Observable<Attribute<string>[]> {
    if (!productId) {
      return throwError(
        () => new Error('getOciPunchoutProductData() of the punchout service called without productId')
      );
    }

    return this.currentCustomer$.pipe(
      switchMap(customer =>
        this.apiService
          .get<{ data: Attribute<string>[] }>(
            `customers/${this.apiService.encodeResourceId(customer.customerNo)}/punchouts/${this.getResourceType(
              'oci'
            )}/validate`,
            {
              headers: this.punchoutHeaderV2,
              params: new HttpParams().set('productId', productId).set('quantity', quantity),
            }
          )
          .pipe(map(data => data.data))
      )
    );
  }

  /**
   * Gets a JSON object with the necessary OCI punchout data for the background search.
   *
   * @param searchString   The search string to search punchout products.
   */
  getOciPunchoutSearchData(searchString: string): Observable<Attribute<string>[]> {
    if (!searchString) {
      return throwError(
        () => new Error('getOciPunchoutSearchData() of the punchout service called without searchString')
      );
    }

    return this.currentCustomer$.pipe(
      switchMap(customer =>
        this.apiService
          .get<{ data: Attribute<string>[] }>(
            `customers/${this.apiService.encodeResourceId(customer.customerNo)}/punchouts/${this.getResourceType(
              'oci'
            )}/background-search`,
            {
              headers: this.punchoutHeaderV2,
              params: new HttpParams().set('searchString', searchString),
            }
          )
          .pipe(map(data => data.data))
      )
    );
  }

  /**
   * Submits the OCI punchout data via HTML form to the OCI punchout system configured in the HOOK_URL
   *
   * @param data     The punchout data retrieved from ICM.
   * @param submit   Controls whether the HTML form is actually submitted (default) or not (only created in the document body).
   */
  submitOciPunchoutData(data: Attribute<string>[], submit = true) {
    if (!data?.length) {
      return throwError(() => new Error('submitOciPunchoutData() of the punchout service called without data'));
    }
    const hookUrl = this.cookiesService.get('punchout_HookURL');
    if (!hookUrl) {
      return throwError(
        () => new Error('no punchout_HookURL available in cookies for OCI Punchout submitPunchoutData()')
      );
    }
    this.submitPunchoutForm(this.createOciForm(data, hookUrl), submit);
  }

  /**
   * Creates an OCI punchout compatible form with hidden input fields that reflect the attributes of the punchout data.
   *
   * @param   data      Attributes (key value pair) array
   * @param   hookUrl   The hook URL
   * @returns           The OCI punchout form
   */
  private createOciForm(data: Attribute<string>[], hookUrl: string): HTMLFormElement {
    const ociForm = this.domService.createElement<HTMLFormElement>('form');
    this.domService.setProperty(ociForm, 'method', 'post');
    this.domService.setProperty(ociForm, 'action', hookUrl);

    data.forEach(inputData => {
      const input = this.domService.createElement('input', ociForm); // prepare a new input DOM element
      this.domService.setProperty(input, 'name', inputData.name);
      this.domService.setProperty(input, 'value', inputData.value);
      this.domService.setProperty(input, 'type', 'hidden');
    });
    return ociForm;
  }

  /**
   * Gets the list of oci configuration items.
   *
   * @returns    An array of punchout oci configuration items.
   */
  getOciConfiguration(): Observable<OciConfigurationItem[]> {
    return this.currentCustomer$.pipe(
      switchMap(customer =>
        this.apiService
          .get<{ items: OciConfigurationItem[] }>(
            `customers/${this.apiService.encodeResourceId(customer.customerNo)}/punchouts/${this.getResourceType(
              'oci'
            )}/configurations`,
            { headers: this.punchoutHeaderV2 }
          )
          .pipe(map(data => data.items))
      )
    );
  }

  /**
   * Gets the oci configuration options (formatters and placeholders).
   *
   * @returns    An array of punchout oci configuration options.
   */
  getOciConfigurationOptions(): Observable<OciOptions> {
    return this.currentCustomer$.pipe(
      switchMap(customer =>
        this.apiService
          // replace the get request by an options request if your ICM version is lower than 12.2.1
          .get<OciOptionsData>(
            `customers/${this.apiService.encodeResourceId(customer.customerNo)}/punchouts/${this.getResourceType(
              'oci'
            )}`,
            { headers: this.punchoutHeaderV2 }
          )
          .pipe(map(OciOptionsMapper.fromData))
      )
    );
  }

  /**
   *  Updates a punchout oci configuration.
   *
   * @param   ociConfiguration  An array of oci configuration items to update.
   * @returns                   The updated oci configuration.
   */
  updateOciConfiguration(ociConfiguration: OciConfigurationItem[]): Observable<OciConfigurationItem[]> {
    if (!ociConfiguration) {
      return throwError(() => new Error('updateOciConfiguration() called without required OciConfiguration'));
    }

    return this.currentCustomer$.pipe(
      switchMap(customer =>
        this.apiService
          .put<{ items: OciConfigurationItem[] }>(
            `customers/${this.apiService.encodeResourceId(customer.customerNo)}/punchouts/${this.getResourceType(
              'oci'
            )}/configurations`,
            { items: ociConfiguration },
            { headers: this.punchoutHeaderV2 }
          )
          .pipe(map(data => data.items))
      )
    );
  }
}
