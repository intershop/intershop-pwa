import { SimpleChange, SimpleChanges } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { anything, instance, mock, when } from 'ts-mockito';

import { PipesModule } from 'ish-core/pipes.module';
import { coreReducers } from 'ish-core/store/core-store.module';
import { AddressMockData } from 'ish-core/utils/dev/address-mock-data';
import { MockComponent } from 'ish-core/utils/dev/mock.component';
import { AddressFormFactory } from '../../components/address-form/address-form.factory';
import { ADDRESS_FORM_FACTORY, AddressFormFactoryProvider } from '../../configurations/address-form-factory.provider';

import { AddressFormContainerComponent } from './address-form.container';

describe('Address Form Container', () => {
  let component: AddressFormContainerComponent;
  let fixture: ComponentFixture<AddressFormContainerComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    const addressFormFactoryMock = mock(AddressFormFactory);
    when(addressFormFactoryMock.getGroup(anything())).thenReturn(AddressMockData.getAddressForm('BG'));

    when(addressFormFactoryMock.countryCode).thenReturn('default');

    TestBed.configureTestingModule({
      declarations: [
        AddressFormContainerComponent,
        MockComponent({
          selector: 'ish-address-form',
          template: 'Address Form Component',
          inputs: ['parentForm', 'countryCode', 'countries', 'regions', 'titles'],
        }),
      ],
      imports: [PipesModule, StoreModule.forRoot(coreReducers)],
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
    component.parentForm.get('countryCodeSwitch').setValue('BG');

    expect(component.parentForm.get('address').get('countryCode').value).toEqual('BG');
    expect(component.regions.length).toBeGreaterThan(0);
    expect(parentForm.get('address').get('mainDivision').validator).not.toBeNull();
  });
});
