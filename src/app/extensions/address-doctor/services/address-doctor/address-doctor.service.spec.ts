import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { pick } from 'lodash-es';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { Address } from 'ish-core/models/address/address.model';
import { StatePropertiesService } from 'ish-core/utils/state-transfer/state-properties.service';

import { AddressDoctorConfig } from '../../models/address-doctor/address-doctor-config.model';

import { AddressDoctorService } from './address-doctor.service';

const mockAddresses = [
  {
    id: '0001"',
    urn: 'urn:address:customer:JgEKAE8BA50AAAFgDtAd1LZU:1001',
    title: 'Ms.',
    firstName: 'Patricia',
    lastName: 'Miller',
    addressLine1: 'Potsdamer Str. 20',
    postalCode: '14483',
    city: 'Berlin',
  },
  {
    id: '0002"',
    urn: 'urn:address:customer:JgEKAE8BA50AAAFgDtAd1LZU:1002',
    title: 'Ms.',
    firstName: 'Patricia',
    lastName: 'Miller',
    addressLine1: 'Berliner Str. 20',
    postalCode: '14482',
    city: 'Berlin',
  },
  {
    id: '0003"',
    urn: 'urn:address:customer:JgEKAE8BA50AAAFgDtAd1LZU:1003',
    title: 'Ms.',
    firstName: 'Patricia',
    lastName: 'Miller',
    addressLine1: 'Neue Promenade 5',
    postalCode: '10178',
    city: 'Berlin',
    companyName1: 'Intershop Communications AG',
  },
  {
    id: '0004"',
    urn: 'urn:address:customer:JgEKAE8BA50AAAFgDtAd1LZU:1004',
    title: 'Ms.',
    firstName: 'Patricia',
    lastName: 'Miller',
    addressLine1: 'Intershop Tower',
    postalCode: '07743',
    city: 'Jena',
    companyName1: 'Intershop Communications AG',
  },
] as Address[];

const response = {
  Status: 'Ok',
  StatusDescription: 'No error',
  JobToken: '2716bb74-490b-4ab5-9fb0-91a838d84d45',
  TransactionInfo: {
    TotalTransactionsCharged: 1,
    TransactionPools: [{ Type: 'INTERACTIVE', TransactionsCharged: 1 }],
  },
  Response: [
    {
      ResultInfo: {
        ProcessStatus: 'F',
        ProcessModeUsed: 'QuickCapture',
        ResultCount: 5,
        ResultCountOverflow: true,
        ResultCountries: ['DEU'],
      },
      Results: [
        {
          Variants: [
            {
              StatusValues: {
                AddressType: 'S',
                ResultGroup: 'Street',
                LanguageISO3: 'DEU',
                UsedVerificationLevel: 'None',
                MatchPercentage: '79.88',
                Script: 'Latin1',
                AddressCount: '1',
                ResultQuality: 5,
              },
              AddressElements: {
                Street: [{ Value: 'Theo-Burauen-Platz', SubItems: { Name: 'Theo-Burauen-Platz' } }],
                HouseNumber: [{ Value: '65432', SubItems: { number: '65432' } }],
                Locality: [
                  { Value: 'Köln', SubItems: { Name: 'Köln' } },
                  { Value: 'Altstadt-Nord', SubItems: { Name: 'Altstadt-Nord' } },
                ],
                PostalCode: [{ Value: '50667', SubItems: { Base: '50667' } }],
                AdministrativeDivision: [
                  {
                    Value: 'Nordrhein-Westfalen',
                    Variants: { Extended: 'Nordrhein-Westfalen', ISO: 'NW', Abbreviation: 'NW' },
                  },
                ],
                Residue: [{ Value: 'TRAINERSTRASSE', Type: 'Superfluous' }],
                Country: [{ Code: 'DE', Name: 'GERMANY' }],
              },
              PreformattedData: {
                SingleAddressLine: { Value: 'Theo-Burauen-Platz 65432;50667 Köln' },
                PostalDeliveryAddressLines: [{ Value: 'Theo-Burauen-Platz 65432' }],
                PostalFormattedAddressLines: [{ Value: 'Theo-Burauen-Platz 65432' }, { Value: '50667 Köln' }],
                PostalLocalityLine: { Value: '50667 Köln' },
              },
            },
          ],
        },
      ],
    },
  ],
};

describe('Address Doctor Service', () => {
  let addressDoctorService: AddressDoctorService;
  let controller: HttpTestingController;
  let statePropertiesService: StatePropertiesService;

  beforeEach(() => {
    statePropertiesService = mock(StatePropertiesService);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: StatePropertiesService, useFactory: () => instance(statePropertiesService) }],
    });
    addressDoctorService = TestBed.inject(AddressDoctorService);

    controller = TestBed.inject(HttpTestingController);

    when(
      statePropertiesService.getStateOrEnvOrDefault<AddressDoctorConfig>('ADDRESS_DOCTOR', 'addressDoctor')
    ).thenReturn(
      of({
        login: 'login',
        password: 'password',
        maxResultCount: 5,
        url: 'http://address-doctor.com',
      })
    );
  });

  afterEach(() => {
    controller.verify();
  });

  it('should be created', () => {
    expect(addressDoctorService).toBeTruthy();
  });

  it('should always call underlying service config/start endpoint with product id', done => {
    addressDoctorService.postAddress(mockAddresses[0]).subscribe({
      next: data => {
        expect(data).toMatchInlineSnapshot(`
[
  {
    "addressLine1": "Theo-Burauen-Platz 65432",
    "city": "Köln Altstadt-Nord",
    "firstName": "Patricia",
    "id": "0001"",
    "lastName": "Miller",
    "postalCode": "50667",
    "title": "Ms.",
    "urn": "urn:address:customer:JgEKAE8BA50AAAFgDtAd1LZU:1001",
  },
]
`);
      },
      error: fail,
      complete: done,
    });

    const req = controller.expectOne(() => true);

    expect(pick(req.request, 'urlWithParams', 'body', 'method')).toMatchInlineSnapshot(`
      {
        "body": {
          "Login": "login",
          "Password": "password",
          "Request": {
            "IO": {
              "Inputs": [
                {
                  "AddressElements": {
                    "Country": undefined,
                  },
                  "PreformattedData": {
                    "SingleAddressLine": "Potsdamer Str. 20;14483;Berlin",
                  },
                },
              ],
            },
            "Parameters": {
              "CountrySets": [
                {
                  "OutputDetail": {
                    "PreformattedData": {
                      "PostalFormattedAddressLines": true,
                      "SingleAddressLine": true,
                      "SingleAddressLineDelimiter": "Semicolon",
                    },
                    "SubItems": true,
                  },
                  "Result": {
                    "MaxResultCount": 5,
                    "NumericRangeExpansion": {
                      "RangeExpansionType": "Flexible",
                      "RangesToExpand": "None",
                    },
                  },
                  "Standardizations": [
                    {
                      "Default": {
                        "AliasHandling": "PostalAdmin",
                        "Casing": "PostalAdmin",
                        "CountryCodeType": "ISO2",
                        "CountryNameType": "NameEN",
                        "DescriptorLength": "Database",
                        "FormatWithCountry": false,
                        "MaxItemLength": 255,
                        "PreferredScript": {
                          "LimitLatinCharacters": "Latin1",
                          "Script": "Latin",
                          "TransliterationType": "Default",
                        },
                      },
                    },
                  ],
                },
              ],
              "Mode": "QuickCapture",
            },
          },
          "UseTransactions": "PRODUCTION",
        },
        "method": "POST",
        "urlWithParams": "http://address-doctor.com",
      }
    `);

    req.flush(response);
  });
});
