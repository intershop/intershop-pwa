import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { IconModule } from 'ish-core/icon.module';
import { PipesModule } from 'ish-core/pipes.module';
import { BasketMockData } from 'ish-core/utils/dev/basket-mock-data';
import { ProductShipmentComponent } from '../../../../shared/product/components/product-shipment/product-shipment.component';
import { ProductVariationDisplayComponent } from '../../../../shared/product/components/product-variation-display/product-variation-display.component';

import { LineItemDescriptionComponent } from './line-item-description.component';

describe('Line Item Description Component', () => {
  let component: LineItemDescriptionComponent;
  let fixture: ComponentFixture<LineItemDescriptionComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [IconModule, NgbPopoverModule, PipesModule, TranslateModule.forRoot()],
      declarations: [
        LineItemDescriptionComponent,
        MockComponent(ProductShipmentComponent),
        MockComponent(ProductVariationDisplayComponent),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LineItemDescriptionComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.pli = BasketMockData.getBasketItem();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display sku for the line item', () => {
    fixture.detectChanges();
    expect(element.querySelector('.product-id').textContent).toContain('4713');
  });

  it('should display in stock for the line item', () => {
    fixture.detectChanges();
    expect(element.querySelector('.product-in-stock')).toBeTruthy();
  });

  it('should hold itemSurcharges for the line item', () => {
    fixture.detectChanges();
    expect(element.querySelectorAll('.details-tooltip')).toHaveLength(1);
  });

  it('should not display itemSurcharges for the line item if not available', () => {
    component.pli = { ...BasketMockData.getBasketItem(), itemSurcharges: undefined };
    expect(() => fixture.detectChanges()).not.toThrow();
    expect(element.querySelectorAll('.details-tooltip')).toHaveLength(0);
  });
});
