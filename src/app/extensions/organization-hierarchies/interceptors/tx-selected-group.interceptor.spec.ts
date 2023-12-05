import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { getConfigurationState, getRestEndpoint } from 'ish-core/store/core/configuration';
import { ConfigurationState } from 'ish-core/store/core/configuration/configuration.reducer';

import { OrganizationGroup } from '../models/organization-group/organization-group.model';
import { getBuyingContext } from '../store/buying-context';
import { BuyingContextState } from '../store/buying-context/buying-context.reducer';

import { TxSelectedGroupInterceptor } from './tx-selected-group.interceptor';

describe('Tx Selected Group Interceptor', () => {
  let httpController: HttpTestingController;
  let http: HttpClient;
  const buyingContext: BuyingContextState = { group: {} as OrganizationGroup, bctx: 'Testgroup@TestCompany' };
  const SITE = 'site';
  const BASE_URL = 'http://example.org/WFS/'.concat(SITE, '/rest');

  const CONFIGURATION: ConfigurationState = {
    serverTranslations: undefined,
    channel: SITE,
    multiSiteLocaleMap: undefined,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: HTTP_INTERCEPTORS, useClass: TxSelectedGroupInterceptor, multi: true },
        provideMockStore({
          initialState: { organizationHierarchies: {} },
          selectors: [
            { selector: getRestEndpoint, value: BASE_URL },
            { selector: getConfigurationState, value: CONFIGURATION },
            { selector: getBuyingContext, value: buyingContext },
          ],
        }),
      ],
    });

    httpController = TestBed.inject(HttpTestingController);
    http = TestBed.inject(HttpClient);
  });

  afterEach(() => {
    httpController.verify();
  });

  it('should include the BuyingGroupID value in the url for a singular group', done => {
    http.get(`${BASE_URL}/some`).subscribe(
      response => {
        expect(response).toBeTruthy();
      },
      error => {
        expect(error).toBeFalsy();
      },
      done
    );
    const requests = httpController.match({ method: 'get' });
    requests[0].flush('All good');
    expect(requests[0].request.url).toContain(
      ';'.concat(TxSelectedGroupInterceptor.matrixparam, '=', buyingContext.bctx)
    );
  });

  it('should NOT include a BuyingGroupID value in the url if request already has one', done => {
    http.get(BASE_URL.concat(';', TxSelectedGroupInterceptor.matrixparam, '=existing/some')).subscribe(
      response => {
        expect(response).toBeTruthy();
      },
      error => {
        expect(error).toBeFalsy();
      },
      done
    );

    const requests = httpController.match({ method: 'get' });
    requests[0].flush('All good');
    expect(requests[0].request.url).toContain(';'.concat(TxSelectedGroupInterceptor.matrixparam, '=existing'));
  });
});
