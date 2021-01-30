import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockDirective, MockPipe } from 'ng-mocks';

import { ProductContextDirective } from 'ish-core/directives/product-context.directive';
import { Price } from 'ish-core/models/price/price.model';
import { PricePipe } from 'ish-core/models/price/price.pipe';
import { BasketMockData } from 'ish-core/utils/dev/basket-mock-data';
import { findAllCustomElements } from 'ish-core/utils/dev/html-query-utils';
import { LineItemListElementComponent } from 'ish-shared/components/line-item/line-item-list-element/line-item-list-element.component';

import { LineItemListComponent } from './line-item-list.component';

describe('Line Item List Component', () => {
  let component: LineItemListComponent;
  let fixture: ComponentFixture<LineItemListComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        LineItemListComponent,
        MockComponent(LineItemListElementComponent),
        MockDirective(ProductContextDirective),
        MockPipe(PricePipe),
      ],
      imports: [TranslateModule.forRoot()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LineItemListComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.lineItems = [BasketMockData.getBasketItem()];
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render sub components if basket changes', () => {
    fixture.detectChanges();
    expect(findAllCustomElements(element)).toMatchInlineSnapshot(`
      Array [
        "ish-line-item-list-element",
      ]
    `);
  });

  describe('totals', () => {
    it('should render totals if set', () => {
      component.total = { value: 1 } as Price;
      fixture.detectChanges();
      expect(element.textContent).toContain('quote.items.total.label');
    });

    it('should not render totals if no line items present', () => {
      component.total = { value: 1 } as Price;
      component.lineItems = [];
      fixture.detectChanges();
      expect(element.textContent).not.toContain('quote.items.total.label');
    });
  });
});
