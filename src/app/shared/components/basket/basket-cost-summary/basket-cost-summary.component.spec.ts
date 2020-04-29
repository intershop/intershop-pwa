import { ComponentFixture, TestBed, async, fakeAsync, tick } from '@angular/core/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { provideMockStore } from '@ngrx/store/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { PricePipe } from 'ish-core/models/price/price.pipe';
import { getPriceDisplayType } from 'ish-core/store/user';
import { BasketMockData } from 'ish-core/utils/dev/basket-mock-data';
import { BasketPromotionComponent } from 'ish-shared/components/basket/basket-promotion/basket-promotion.component';
import { PromotionDetailsComponent } from 'ish-shared/components/promotion/promotion-details/promotion-details.component';

import { BasketCostSummaryComponent } from './basket-cost-summary.component';

describe('Basket Cost Summary Component', () => {
  let component: BasketCostSummaryComponent;
  let fixture: ComponentFixture<BasketCostSummaryComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        BasketCostSummaryComponent,
        MockComponent(BasketPromotionComponent),
        MockComponent(FaIconComponent),
        MockComponent(NgbPopover),
        MockComponent(PromotionDetailsComponent),
        PricePipe,
      ],
      imports: [TranslateModule.forRoot()],
      providers: [provideMockStore({ selectors: [{ selector: getPriceDisplayType, value: 'gross' }] })],
    })
      // tslint:disable-next-line: no-any
      .configureCompiler({ preserveWhitespaces: true } as any)
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasketCostSummaryComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.totals = BasketMockData.getTotals();

    const translate: TranslateService = TestBed.get(TranslateService);
    translate.use('en');
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display mocked prices when rendered', fakeAsync(() => {
    fixture.detectChanges();
    tick(500);

    expect(element.textContent.replace(/^\s*[\r\n]*/gm, '')).toMatchInlineSnapshot(`
      "checkout.cart.subtotal.heading
      $141,796.98
      -$11.90
      checkout.order.shipping.label
      product.price.na.text
      Battery Deposit Surcharge
      shopping_cart.detail.text
      $595.00
      checkout.cart.payment_cost.label
      $3.57
      checkout.tax.TaxesLabel.TotalOrderVat
      $22,747.55
      checkout.order.total_cost.label
      $142,470.71
      "
    `);
  }));

  it('should not display estimated prices if estimated flag is not set', fakeAsync(() => {
    fixture.detectChanges();
    tick(500);

    expect(element.querySelector('.total-price').textContent.trim()).toEqual('checkout.order.total_cost.label');
  }));
  it('should display estimated prices if estimated flag is set', fakeAsync(() => {
    component.totals.isEstimated = true;
    fixture.detectChanges();
    tick(500);

    expect(element.querySelector('.total-price').textContent.trim()).toEqual('checkout.cart.estimated_total.label');
  }));

  it('should not display paymentCostsTotal when value is zero', fakeAsync(() => {
    component.totals = {
      ...BasketMockData.getTotals(),
      paymentCostsTotal: { type: 'PriceItem', currency: 'USD', gross: 0.0, net: 0.0 },
    };
    fixture.detectChanges();
    tick(500);

    expect(element.textContent).not.toContain('checkout.cart.payment_cost.label');
  }));
});
