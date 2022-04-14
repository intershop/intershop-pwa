import { TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { instance, mock } from 'ts-mockito';

import { Address } from 'ish-core/models/address/address.model';
import { SelectOption } from 'ish-core/models/select-option/select-option.model';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';

import { FormsService } from './forms.service';

describe('Forms Service', () => {
  let translateServiceMock: TranslateService;
  let formsService: FormsService;

  beforeEach(() => {
    translateServiceMock = mock(TranslateService);
    TestBed.configureTestingModule({
      imports: [CoreStoreModule.forTesting(['configuration'])],
      providers: [{ provide: TranslateService, useFactory: () => instance(translateServiceMock) }],
    });
    formsService = TestBed.inject(FormsService);
  });

  it('should be created', () => {
    expect(formsService).toBeTruthy();
  });

  describe('getSalutationOptionsForCountryCode', () => {
    it('should return an empty array if countryCode is empty', () => {
      expect(formsService.getSalutationOptionsForCountryCode('')).toBeEmpty();
    });

    it('should return an empty array if countryCode is not known', () => {
      expect(formsService.getSalutationOptionsForCountryCode('BG')).toBeEmpty();
    });

    it('should return salutations if countryCode is GB', () => {
      expect(formsService.getSalutationOptionsForCountryCode('GB')).toHaveLength(3);
    });

    it('should return salutations if countryCode is US', () => {
      expect(formsService.getSalutationOptionsForCountryCode('US')).toHaveLength(3);
    });

    it('should return salutations if countryCode is DE', () => {
      expect(formsService.getSalutationOptionsForCountryCode('DE')).toHaveLength(3);
    });

    it('should return salutations if countryCode is FR', () => {
      expect(formsService.getSalutationOptionsForCountryCode('FR')).toHaveLength(3);
    });
  });

  describe('getAddressOptions', () => {
    it('should return address options if addresses are given', done => {
      FormsService.getAddressOptions(
        of([
          { id: '12345', firstName: 'Patricia', lastName: 'Miller', addressLine1: 'Potsdamer Str.', city: 'Berlin' },
          { id: '67890', firstName: 'Bernhard', lastName: 'Boldner', addressLine1: 'Berliner Str.', city: 'Hamburg' },
        ] as Address[])
      ).subscribe((options: SelectOption[]) => {
        expect(options).toMatchInlineSnapshot(`
          Array [
            Object {
              "label": "Patricia Miller, Potsdamer Str., Berlin",
              "value": "12345",
            },
            Object {
              "label": "Bernhard Boldner, Berliner Str., Hamburg",
              "value": "67890",
            },
          ]
        `);
        done();
      });
    });
  });

  describe('getCostCenterBudgetPeriodOptions', () => {
    it('should return budget period options if called', () => {
      expect(FormsService.getCostCenterBudgetPeriodOptions()).toHaveLength(4);
    });
  });
});
