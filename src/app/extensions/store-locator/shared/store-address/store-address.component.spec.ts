import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { MockComponent } from 'ng-mocks';

import { Store as StoreModel } from '../../models/store/store.model';

import { StoreAddressComponent } from './store-address.component';

describe('Store Address Component', () => {
  let component: StoreAddressComponent;
  let fixture: ComponentFixture<StoreAddressComponent>;
  let element: HTMLElement;
  let store: StoreModel;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MockComponent(FaIconComponent), StoreAddressComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreAddressComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    store = {
      id: '',
      name: '',
      address: '',
      city: '',
      postalCode: '',
      country: '',
      countryCode: '',
      phone: '',
      email: '',
      fax: '',
      latitude: 0,
      longitude: 0,
    };
    component.store = store;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
