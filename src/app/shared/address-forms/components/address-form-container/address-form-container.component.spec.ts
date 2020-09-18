import { SimpleChange, SimpleChanges } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { anyString, anything, instance, mock, verify, when } from 'ts-mockito';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { AppFacade } from 'ish-core/facades/app.facade';
import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { Region } from 'ish-core/models/region/region.model';
import { AddressMockData } from 'ish-core/utils/dev/address-mock-data';
import { AddressFormComponent } from 'ish-shared/address-forms/components/address-form/address-form.component';
import { AddressFormFactory } from 'ish-shared/address-forms/components/address-form/address-form.factory';
import {
  ADDRESS_FORM_FACTORY,
  AddressFormFactoryProvider,
} from 'ish-shared/address-forms/configurations/address-form-factory.provider';

import { AddressFormContainerComponent } from './address-form-container.component';

describe('Address Form Container Component', () => {
  let component: AddressFormContainerComponent;
  let fixture: ComponentFixture<AddressFormContainerComponent>;
  let element: HTMLElement;
  let accountFacade: AccountFacade;
  let appFacade: AppFacade;

  beforeEach(async () => {
    const addressFormFactoryMock = mock(AddressFormFactory);
    when(addressFormFactoryMock.getGroup(anything())).thenReturn(AddressMockData.getAddressForm('BG'));

    when(addressFormFactoryMock.countryCode).thenReturn('default');

    accountFacade = mock(AccountFacade);
    appFacade = mock(AppFacade);

    await TestBed.configureTestingModule({
      imports: [FeatureToggleModule.forTesting()],
      declarations: [AddressFormContainerComponent, MockComponent(AddressFormComponent)],
      providers: [
        AddressFormFactoryProvider,
        { provide: ADDRESS_FORM_FACTORY, useFactory: () => instance(addressFormFactoryMock), multi: true },
        { provide: AccountFacade, useFactory: () => instance(accountFacade) },
        { provide: AppFacade, useFactory: () => instance(appFacade) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressFormContainerComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    const regions: Region[] = [{ countryCode: 'BG', id: 'BGS', name: 'Sofia', regionCode: 'S' }];
    when(appFacade.regions$(anyString())).thenReturn(of(regions));
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render address form component on page', () => {
    fixture.detectChanges();
    expect(element.querySelector('ish-address-form')).toBeTruthy();
  });

  it('should react on country changes', () => {
    when(accountFacade.isBusinessCustomer$).thenReturn(of(true));

    const newCountry = 'BG';

    const parentForm = new FormGroup({
      countryCodeSwitch: new FormControl('DE'),
      address: new FormGroup({}),
    });
    component.parentForm = parentForm;

    const changes: SimpleChanges = {
      parentForm: new SimpleChange(undefined, component.parentForm, false),
    };

    fixture.detectChanges();
    component.ngOnChanges(changes);
    component.parentForm.get('countryCodeSwitch').setValue(newCountry);

    expect(component.parentForm.get('address').get('countryCode').value).toEqual(newCountry);
    verify(appFacade.regions$(newCountry)).once();
    expect(parentForm.get('address').get('mainDivisionCode').validator).not.toBeNull();
  });
});
