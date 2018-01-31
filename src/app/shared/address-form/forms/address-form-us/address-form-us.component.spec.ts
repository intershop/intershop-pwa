import { NO_ERRORS_SCHEMA } from '@angular/core/';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs/observable/of';
import { instance, mock, when } from 'ts-mockito';
import { RegionData } from '../../../../../models/region/region.interface';
import { RegionService } from '../../../../services/countries/region.service';
import { InputComponent } from '../../../form-controls/input/input.component';
import { SelectRegionComponent } from '../../../form-controls/select-region/select-region.component';
import { AddressFormUSComponent } from './address-form-us.component';

describe('American Address Component', () => {
  let component: AddressFormUSComponent;
  let fixture: ComponentFixture<AddressFormUSComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    const regionServiceMock = mock(RegionService);
    when(regionServiceMock.getRegions('US')).thenReturn(
      of(
        { countryCode: 'US', regionCode: 'AL', name: 'Alabama' } as RegionData,
        { countryCode: 'US', regionCode: 'TX', name: 'Texas' } as RegionData
      )
    );
    TestBed.configureTestingModule({
      declarations: [AddressFormUSComponent, InputComponent, SelectRegionComponent],
      providers: [
        { provide: RegionService, useFactory: () => instance(regionServiceMock) }
      ],
      imports: [
        TranslateModule.forRoot()
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents().then(() => {
        fixture = TestBed.createComponent(AddressFormUSComponent);
        component = fixture.componentInstance;
        element = fixture.nativeElement;

        const addressForm = new FormGroup({
          countryCode: new FormControl('US'),
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
  });

  it('should display an apo/fpo popover link on creation', () => {
    fixture.detectChanges();
    expect(element.querySelector('a[placement]')).toBeTruthy('popover link is shown');
  });
});

