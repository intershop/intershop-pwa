import { TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { isEmpty, of } from 'rxjs';
import { anyString, instance, mock, when } from 'ts-mockito';

import { Address } from 'ish-core/models/address/address.model';
import { SelectOption } from 'ish-core/models/select-option/select-option.model';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';

import { FormsService } from './forms.service';

describe('Forms Service', () => {
  let translateServiceMock: TranslateService;
  let formsService: FormsService;

  beforeEach(() => {
    translateServiceMock = mock(TranslateService);
    when(translateServiceMock.get(anyString())).thenReturn(of([]));

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
      formsService.getSalutationOptionsForCountryCode('').pipe(isEmpty());
    });

    it('should return an empty array if countryCode is not known', () => {
      formsService.getSalutationOptionsForCountryCode('BG').pipe(isEmpty());
    });

    it('should return salutations if countryCode is GB', done => {
      formsService.getSalutationOptionsForCountryCode('GB').subscribe(data => {
        expect(data).toHaveLength(3);
        done();
      });
    });

    it('should return salutations if countryCode is US', done => {
      formsService.getSalutationOptionsForCountryCode('US').subscribe(data => {
        expect(data).toHaveLength(3);
        done();
      });
    });

    it('should return salutations if countryCode is DE', done => {
      formsService.getSalutationOptionsForCountryCode('DE').subscribe(data => {
        expect(data).toHaveLength(3);
        done();
      });
    });

    it('should return salutations if countryCode is FR', done => {
      formsService.getSalutationOptionsForCountryCode('FR').subscribe(data => {
        expect(data).toHaveLength(3);
        done();
      });
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
          [
            {
              "label": "Patricia Miller, Potsdamer Str., Berlin",
              "value": "12345",
            },
            {
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
      expect(FormsService.getCostCenterBudgetPeriodOptions()).toHaveLength(6);
    });
  });

  describe('addAriaDescribedById', () => {
    it('should add an id to an empty ariaDescribedBy property', () => {
      expect(FormsService.addAriaDescribedById('', 'ariaDescribedById1')).toBe('ariaDescribedById1');
    });

    it('should add an id to an existing ariaDescribedBy property', () => {
      const ariaDescribedBy = 'ariaDescribedById1 ariaDescribedById2';
      expect(FormsService.addAriaDescribedById(ariaDescribedBy, 'ariaDescribedById3')).toBe(
        'ariaDescribedById1 ariaDescribedById2 ariaDescribedById3'
      );
    });
  });

  describe('removeAriaDescribedById', () => {
    it('should return undefined if the given ariaDescribedBy contains only the given elementId', () => {
      expect(FormsService.removeAriaDescribedById('ariaDescribedById1', 'ariaDescribedById1')).toBeUndefined();
    });

    it('should remove the given id from an existing ariaDescribedBy property', () => {
      const ariaDescribedBy = 'ariaDescribedById1 ariaDescribedById2';
      expect(FormsService.removeAriaDescribedById(ariaDescribedBy, 'ariaDescribedById1')).toBe('ariaDescribedById2');
      expect(FormsService.removeAriaDescribedById(ariaDescribedBy, 'ariaDescribedById2')).toBe('ariaDescribedById1');
    });
  });
});
