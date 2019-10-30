import { SimpleChange, SimpleChanges } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Store } from '@ngrx/store';
import { MockComponent } from 'ng-mocks';
import { anything, deepEqual, instance, mock, spy, verify, when } from 'ts-mockito';

import { Customer } from 'ish-core/models/customer/customer.model';
import { Region } from 'ish-core/models/region/region.model';
import { coreReducers } from 'ish-core/store/core-store.module';
import { LoadRegions, LoadRegionsSuccess } from 'ish-core/store/regions';
import { LoginUserSuccess } from 'ish-core/store/user';
import { AddressMockData } from 'ish-core/utils/dev/address-mock-data';
import { ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';
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
  let store$: Store<{}>;

  beforeEach(async(() => {
    const addressFormFactoryMock = mock(AddressFormFactory);
    when(addressFormFactoryMock.getGroup(anything())).thenReturn(AddressMockData.getAddressForm('BG'));

    when(addressFormFactoryMock.countryCode).thenReturn('default');

    TestBed.configureTestingModule({
      declarations: [AddressFormContainerComponent, MockComponent(AddressFormComponent)],
      imports: [RouterTestingModule, ngrxTesting({ reducers: coreReducers })],
      providers: [
        AddressFormFactoryProvider,
        { provide: ADDRESS_FORM_FACTORY, useFactory: () => instance(addressFormFactoryMock), multi: true },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressFormContainerComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    store$ = TestBed.get(Store);
    const customer: Customer = { customerNo: '1', type: 'SMBCustomer' };
    const region: Region[] = [{ countryCode: 'BG', id: 'BGS', name: 'Sofia', regionCode: 'S' }];
    store$.dispatch(new LoginUserSuccess({ customer }));
    store$.dispatch(new LoadRegionsSuccess({ regions: region }));
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
    const storeSpy$ = spy(store$);
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
    verify(storeSpy$.dispatch(deepEqual(new LoadRegions({ countryCode: newCountry })))).once();
    expect(parentForm.get('address').get('mainDivisionCode').validator).not.toBeNull();
  });
});
