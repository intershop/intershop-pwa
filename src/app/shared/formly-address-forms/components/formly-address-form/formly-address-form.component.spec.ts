import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormlyFieldConfig, FormlyModule as FormlyBaseModule } from '@ngx-formly/core';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { AppFacade } from 'ish-core/facades/app.facade';
import { Country } from 'ish-core/models/country/country.model';
import {
  ADDRESS_FORM_CONFIGURATION,
  AddressFormConfigurationProvider,
} from 'ish-shared/formly-address-forms/configurations/address-form-configuration.provider';
import { AddressFormConfiguration } from 'ish-shared/formly-address-forms/configurations/address-form.configuration';
import { FormlyTestingComponentsModule } from 'ish-shared/formly/dev/testing/formly-testing-components.module';
import { FormlyTestingExampleComponent } from 'ish-shared/formly/dev/testing/formly-testing-example/formly-testing-example.component';
import { FormlyTestingFieldgroupExampleComponent } from 'ish-shared/formly/dev/testing/formly-testing-fieldgroup-example/formly-testing-fieldgroup-example.component';

import { FormlyAddressFormComponent } from './formly-address-form.component';

const configurations: { [key: string]: FormlyFieldConfig[] } = {
  default: [
    {
      key: 'firstName',
      type: 'ish-text-input-field',
      templateOptions: {
        label: 'default input',
        required: true,
      },
    },
  ],
  exampleCountry: [
    {
      key: 'firstName',
      type: 'ish-text-input-field',
      templateOptions: {
        label: 'example input',
        required: true,
      },
    },
    {
      key: 'lastName',
      type: 'ish-text-input-field',
      templateOptions: {
        label: 'last name',
      },
    },
  ],
  b2b: [
    {
      key: 'companyName1',
      type: 'ish-text-input-field',
      templateOptions: {
        label: 'example input',
        required: true,
      },
    },
  ],
};

const models = {
  default: {
    firstName: '',
  },
  exampleCountry: {
    firstName: '',
    lastName: '',
  },
  b2b: {
    companyName1: '',
  },
};

class AddressFormDefaultConfigurationMock extends AddressFormConfiguration {
  countryCode = 'default';

  getModel() {
    if (this.businessCustomer) {
      return models.b2b;
    }
    return models.default;
  }

  getFieldConfiguration() {
    if (this.businessCustomer) {
      return configurations.b2b;
    }
    return configurations.default;
  }
}

class AddressFormExampleConfigurationMock extends AddressFormConfiguration {
  countryCode = 'exampleCountry';

  getModel() {
    return models.exampleCountry;
  }

  getFieldConfiguration() {
    return configurations.exampleCountry;
  }
}

describe('Formly Address Form Component', () => {
  let component: FormlyAddressFormComponent;
  let fixture: ComponentFixture<FormlyAddressFormComponent>;
  let element: HTMLElement;
  const appFacade = mock(AppFacade);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormlyAddressFormComponent],
      imports: [
        FormlyBaseModule.forRoot({
          types: [
            {
              name: 'ish-fieldset-field',
              component: FormlyTestingFieldgroupExampleComponent,
            },
            {
              name: 'ish-text-input-field',
              component: FormlyTestingExampleComponent,
            },
            {
              name: 'ish-select-field',
              component: FormlyTestingExampleComponent,
            },
          ],
        }),
        FormlyTestingComponentsModule,
      ],
      providers: [
        AddressFormConfigurationProvider,
        { provide: ADDRESS_FORM_CONFIGURATION, useClass: AddressFormDefaultConfigurationMock, multi: true },
        { provide: ADDRESS_FORM_CONFIGURATION, useClass: AddressFormExampleConfigurationMock, multi: true },
        { provide: AppFacade, useFactory: () => instance(appFacade) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormlyAddressFormComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    when(appFacade.countries$()).thenReturn(
      of([
        { countryCode: 'default', name: 'default' },
        { countryCode: 'exampleCountry', name: 'exampleCountry' },
      ] as Country[])
    );
  });

  it('should be created', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should always start with default configuration and render correctly', () => {
    fixture.detectChanges();

    expect(element.querySelector('[data-testing-id="countryCode"]')).toBeTruthy();
    expect(element.querySelector('[data-testing-id="firstName"]')).toBeTruthy();
  });

  it('should switch to exampleCountry form on country change', () => {
    fixture.detectChanges();

    component.addressForm.get('countryCode').setValue('exampleCountry');
    component.addressForm.get('countryCode').markAsDirty();
    // trigger two change detection cycles: one to have formly read the changed form and load the configuration. Another to apply the updated configuration in the DOM
    fixture.detectChanges();
    fixture.detectChanges();
    expect(element.querySelector('[data-testing-id="countryCode"]')).toBeTruthy();
    expect(component.addressModel.countryCode).toEqual('exampleCountry');
    expect(element.querySelector('[data-testing-id="firstName"]')).toBeTruthy();
    expect(element.querySelector('[data-testing-id="lastName"]')).toBeTruthy();
  });

  it('should display b2b config if businessCustomer flag is true', () => {
    component.businessCustomer = true;
    fixture.detectChanges();
    expect(element.querySelector('[data-testing-id="companyName1"')).toBeTruthy();
  });
});
