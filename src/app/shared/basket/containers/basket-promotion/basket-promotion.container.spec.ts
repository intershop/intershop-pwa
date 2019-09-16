import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { combineReducers } from '@ngrx/store';
import { MockComponent } from 'ng-mocks';

import { BasketRebate } from 'ish-core/models/basket-rebate/basket-rebate.model';
import { shoppingReducers } from 'ish-core/store/shopping/shopping-store.module';
import { ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';
import { BasketPromotionComponent } from 'ish-shared/basket/components/basket-promotion/basket-promotion.component';

import { BasketPromotionContainerComponent } from './basket-promotion.container';

describe('Basket Promotion Container', () => {
  let component: BasketPromotionContainerComponent;
  let fixture: ComponentFixture<BasketPromotionContainerComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ngrxTesting({
          reducers: {
            shopping: combineReducers(shoppingReducers),
          },
        }),
      ],
      declarations: [BasketPromotionContainerComponent, MockComponent(BasketPromotionComponent)],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasketPromotionContainerComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.rebate = {
      id: 'test',
      promotionId: 'PROMO_UUID',
    } as BasketRebate;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
