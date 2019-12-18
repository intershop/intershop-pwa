import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { BasketRebate } from 'ish-core/models/basket-rebate/basket-rebate.model';
import { getICMBaseURL } from 'ish-core/store/configuration';
import { PromotionDetailsComponent } from 'ish-shared/components/promotion/promotion-details/promotion-details.component';

import { BasketPromotionComponent } from './basket-promotion.component';

describe('Basket Promotion Component', () => {
  let component: BasketPromotionComponent;
  let fixture: ComponentFixture<BasketPromotionComponent>;
  let element: HTMLElement;
  let shoppingFacade: ShoppingFacade;

  beforeEach(async(() => {
    shoppingFacade = mock(ShoppingFacade);

    TestBed.configureTestingModule({
      declarations: [BasketPromotionComponent, MockComponent(PromotionDetailsComponent), ServerHtmlDirective],
      imports: [RouterTestingModule],
      providers: [
        { provide: ShoppingFacade, useFactory: () => instance(shoppingFacade) },
        provideMockStore({ selectors: [{ selector: getICMBaseURL, value: 'example.org' }] }),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasketPromotionComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => component.ngOnChanges()).not.toThrow();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display the promotion title for the given promotion', () => {
    when(shoppingFacade.promotion$('PROMO_UUID')).thenReturn(
      of({
        id: 'PROMO_UUID',
        title: 'MyPromotionTitle',
        disableMessages: false,
      })
    );

    component.rebate = {
      promotionId: 'PROMO_UUID',
    } as BasketRebate;
    component.ngOnChanges();
    fixture.detectChanges();

    expect(element).toMatchInlineSnapshot(`
      <div>
        <div class="promotion-title">MyPromotionTitle</div>
        <ish-promotion-details></ish-promotion-details>
      </div>
    `);
  });

  it('should not display the promotion if messages are disabled', () => {
    when(shoppingFacade.promotion$('PROMO_UUID')).thenReturn(
      of({
        id: 'PROMO_UUID',
        title: 'MyPromotionTitle',
        disableMessages: true,
      })
    );

    component.rebate = {
      promotionId: 'PROMO_UUID',
    } as BasketRebate;
    component.ngOnChanges();
    fixture.detectChanges();

    expect(element).toMatchInlineSnapshot(`N/A`);
  });
});
