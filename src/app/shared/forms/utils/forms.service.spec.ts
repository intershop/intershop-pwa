import { TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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

  describe('focusFirstInvalidFieldRecursive', () => {
    it('should focus on the first invalid field in a form', () => {
      const form = new FormGroup({
        field1: new FormControl('', Validators.required),
        field2: new FormControl('', Validators.required),
        field3: new FormControl(''),
      });

      const element1 = document.createElement('input');
      element1.id = 'formly_field1';
      document.body.appendChild(element1);

      const element2 = document.createElement('input');
      element2.id = 'formly_field2';
      document.body.appendChild(element2);

      const element3 = document.createElement('input');
      element3.id = 'formly_field3';
      document.body.appendChild(element3);

      form.controls.field1.markAsTouched();
      form.controls.field2.markAsTouched();

      formsService.focusFirstInvalidFieldRecursive(form);

      expect(document.activeElement).toBe(element1);
    });
  });
});
