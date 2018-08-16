import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { BasketMockData } from '../../../../utils/dev/basket-mock-data';

import { AddressComponent } from './address.component';

describe('Address Component', () => {
  let component: AddressComponent;
  let fixture: ComponentFixture<AddressComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddressComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.address = BasketMockData.getAddress();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render nothing if address is missing', () => {
    component.address = undefined;
    fixture.detectChanges();
    expect(element.querySelector('address')).toBeFalsy();
  });

  it('should render an address if address is given', () => {
    fixture.detectChanges();
    expect(element.querySelector('address')).toBeTruthy();
    expect(element.querySelector('address').innerHTML).toContain('Ms.');
    expect(element.querySelector('address').innerHTML).toContain('Patricia');
    expect(element.querySelector('address').innerHTML).toContain('Miller');
    expect(element.querySelector('address').innerHTML).toContain('Potsdamer Str. 20');
    expect(element.querySelector('address').innerHTML).toContain('14483');
    expect(element.querySelector('address').innerHTML).toContain('Berlin');
    expect(element.querySelector('address').innerHTML).toContain('Germany');
    expect(element.querySelector('address').innerHTML).toContain('049364112677');
  });

  it('should display postalCode before city if the country is Germany', () => {
    component.address.countryCode = 'DE';
    fixture.detectChanges();
    expect(element.querySelector('address').innerHTML).toContain('14483&nbsp;');
  });

  it('should display postalCode after city if the country is US', () => {
    component.address.countryCode = 'US';
    fixture.detectChanges();
    expect(element.querySelector('address').innerHTML).toContain('Berlin&nbsp;');
  });
});
