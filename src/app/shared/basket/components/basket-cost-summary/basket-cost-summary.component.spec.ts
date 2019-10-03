import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { PipesModule } from 'ish-core/pipes.module';
import { BasketMockData } from 'ish-core/utils/dev/basket-mock-data';
import { BasketPromotionContainerComponent } from 'ish-shared/basket/containers/basket-promotion/basket-promotion.container';
import { PromotionDetailsComponent } from 'ish-shared/promotion/components/promotion-details/promotion-details.component';

import { BasketCostSummaryComponent } from './basket-cost-summary.component';

describe('Basket Cost Summary Component', () => {
  let component: BasketCostSummaryComponent;
  let fixture: ComponentFixture<BasketCostSummaryComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        BasketCostSummaryComponent,
        MockComponent(BasketPromotionContainerComponent),
        MockComponent(FaIconComponent),
        MockComponent(NgbPopover),
        MockComponent(PromotionDetailsComponent),
      ],
      imports: [PipesModule, TranslateModule.forRoot()],
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
