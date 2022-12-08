import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { pick } from 'lodash-es';

import { Address } from 'ish-core/models/address/address.model';
import { FormlyTestingModule } from 'ish-shared/formly/dev/testing/formly-testing.module';

import { AddressDoctorModalComponent } from './address-doctor-modal.component';

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

describe('Address Doctor Modal Component', () => {
  let component: AddressDoctorModalComponent;
  let fixture: ComponentFixture<AddressDoctorModalComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormlyTestingModule, TranslateModule.forRoot()],
      declarations: [AddressDoctorModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent<typeof component>(AddressDoctorModalComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display modal dialog when open function is called', () => {
    fixture.detectChanges();
    component.openModal(mockAddresses[0], mockAddresses);
    expect(component.ngbModalRef).toBeTruthy();

    const mapped = component.fields.map(field => pick(field, ['type', 'key']));
    expect(mapped).toMatchInlineSnapshot(
      `
        [
          {
            "key": "defaultText",
            "type": "ish-html-text-field",
          },
          {
            "key": "address",
            "type": "ish-radio-field",
          },
          {
            "key": "suggestionText",
            "type": "ish-html-text-field",
          },
          {
            "key": "address",
            "type": "ish-radio-field",
          },
          {
            "key": "address",
            "type": "ish-radio-field",
          },
          {
            "key": "address",
            "type": "ish-radio-field",
          },
          {
            "key": "address",
            "type": "ish-radio-field",
          },
        ]
      `
    );
  });

  it('should not display modal dialog when open function is not called', () => {
    fixture.detectChanges();
    expect(component.ngbModalRef).toBeFalsy();
  });
});
