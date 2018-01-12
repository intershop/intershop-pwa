import { NO_ERRORS_SCHEMA } from '@angular/core/';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { instance, mock, when } from 'ts-mockito';
import { RegionData } from '../../../../../models/region/region.interface';
import { RegionService } from '../../../../services/countries/region.service';
import { InputComponent } from '../../../form-controls/input/input.component';
import { SelectRegionComponent } from '../../../form-controls/select-region/select-region.component';
import { AddressDefaultComponent } from './address-default.component';

describe('Default Address Component', () => {
  let component: AddressDefaultComponent;
  let fixture: ComponentFixture<AddressDefaultComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    const regionServiceMock = mock(RegionService);
    when(regionServiceMock.getRegions('BG')).thenReturn(
      Observable.of(
        { countryCode: 'BG', regionCode: '02', name: 'Burgas' } as RegionData,
        { countryCode: 'BG', regionCode: '23', name: 'Sofia' } as RegionData
      )
    );
    when(regionServiceMock.getRegions('IN')).thenReturn(
      Observable.of()
    );
    TestBed.configureTestingModule({
      declarations: [AddressDefaultComponent, InputComponent, SelectRegionComponent],
      providers: [
        { provide: RegionService, useFactory: () => instance(regionServiceMock) }
      ],
      imports: [
        TranslateModule.forRoot()
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents().then(() => {
        fixture = TestBed.createComponent(AddressDefaultComponent);
        component = fixture.componentInstance;
        element = fixture.nativeElement;

        const addressForm = new FormGroup({
          countryCode: new FormControl('BG'),
          firstName: new FormControl(''),
          lastName: new FormControl(''),
          addressLine1: new FormControl(''),
          addressLine2: new FormControl(''),
          postalCode: new FormControl(''),
          city: new FormControl('')
        });
        component.addressForm = addressForm;
      });
  }));

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
  });

  it('should throw an error if input parameter addressForm is not set', () => {
    component.addressForm = null;
    expect(function() { fixture.detectChanges(); }).toThrow();
  });

  it('should create special form parameters on creation', () => {
    expect(component.addressForm.get('state')).toBeNull('state control does not exist before onInit');
    fixture.detectChanges();
    expect(component.addressForm.get('state').value).toEqual('', 'state control exists after onInit');
  });

  it('should set special validators on creation', () => {
    expect(component.addressForm.get('postalCode').validator).toBeNull('postalCode control has no validator before onInit');
    fixture.detectChanges();
    expect(component.addressForm.get('postalCode').validator).toBeTruthy('postalCode control has a validator after onInit');
  });

  it('should display form input fields on creation', () => {
    fixture.detectChanges();
    expect(element.querySelector('input[data-testing-id=firstName]')).toBeTruthy('first name is rendered');
    expect(element.querySelector('input[data-testing-id=lastName]')).toBeTruthy('last name is rendered');
    expect(element.querySelector('input[data-testing-id=addressLine1]')).toBeTruthy('addressLine1 is rendered');
    expect(element.querySelector('input[data-testing-id=addressLine2]')).toBeTruthy('addressLine2 is rendered');
    expect(element.querySelector('input[data-testing-id=city]')).toBeTruthy('city is rendered');
    expect(element.querySelector('select[data-testing-id=state]')).toBeTruthy('state is rendered');
    expect(element.querySelector('input[data-testing-id=postalCode]')).toBeTruthy('postalCode is rendered');
    expect(element.querySelector('ish-select-region')).toBeTruthy('region component is rendered');
  });

  it('should set/unset required validator for state if countryCode has changed', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    expect(component.addressForm.get('state').validator).toBeTruthy('state control has a validator after countryCode has changed');
    component.addressForm.get('countryCode').setValue('IN');
    fixture.detectChanges();
    tick();
    expect(component.addressForm.get('state').validator).toBeFalsy('state control has no validator if countryCode is empty');
  }));

  it('should not render region component if no country is selected', () => {
    component.addressForm.get('countryCode').setValue('');
    fixture.detectChanges();
    expect(element.querySelector('ish-select-region')).toBeFalsy('region component is not rendered');
  });
});
