import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasketMockData } from 'ish-core/utils/dev/basket-mock-data';

import { AddressComponent } from './address.component';

describe('Address Component', () => {
  let component: AddressComponent;
  let fixture: ComponentFixture<AddressComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddressComponent],
    }).compileComponents();
  });

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

  it('should not render an email if displayEmail is not set', () => {
    fixture.detectChanges();
    expect(element.querySelector('address').innerHTML).not.toContain('patricia@test.intershop.de');
  });

  it('should render an email if displayEmail is set', () => {
    component.displayEmail = true;
    fixture.detectChanges();
    expect(element.querySelector('address').innerHTML).toContain('patricia@test.intershop.de');
  });
});
