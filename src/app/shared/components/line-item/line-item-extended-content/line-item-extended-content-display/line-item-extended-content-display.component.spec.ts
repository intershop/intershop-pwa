import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasketMockData } from 'ish-core/utils/dev/basket-mock-data';

import { LineItemExtendedContentDisplayComponent } from './line-item-extended-content-display.component';

describe('Line Item Extended Content Display Component', () => {
  let component: LineItemExtendedContentDisplayComponent;
  let fixture: ComponentFixture<LineItemExtendedContentDisplayComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LineItemExtendedContentDisplayComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LineItemExtendedContentDisplayComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    component.lineItem = BasketMockData.getBasketItem();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should not dislayed if custom attributes not existing', () => {
    component.lineItem.partialOrderNo = undefined;
    component.lineItem.customerProductID = undefined;
    fixture.detectChanges();

    expect(element.querySelector('span[class="line-item-attributes-info span-separator"]')).toBeFalsy();
  });
});
