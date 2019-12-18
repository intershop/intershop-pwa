import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockPipe } from 'ng-mocks';

import { PricePipe } from 'ish-core/models/price/price.pipe';
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
        MockPipe(PricePipe),
      ],
      imports: [TranslateModule.forRoot()],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasketCostSummaryComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.totals = BasketMockData.getTotals();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should not display estimated prices if estimated flag is not set', () => {
    fixture.detectChanges();
    expect(element.querySelector('.total-price').textContent).toEqual('checkout.order.total_cost.label');
  });
  it('should display estimated prices if estimated flag is set', () => {
    component.totals.isEstimated = true;
    fixture.detectChanges();
    expect(element.querySelector('.total-price').textContent).toEqual('checkout.cart.estimated_total.label');
  });
});
