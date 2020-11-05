import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent, MockDirective } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { AppFacade } from 'ish-core/facades/app.facade';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { BasketRebate } from 'ish-core/models/basket-rebate/basket-rebate.model';
import { Promotion } from 'ish-core/models/promotion/promotion.model';
import { PromotionDetailsComponent } from 'ish-shared/components/promotion/promotion-details/promotion-details.component';
import { PromotionRemoveComponent } from 'ish-shared/components/promotion/promotion-remove/promotion-remove.component';

import { BasketPromotionComponent } from './basket-promotion.component';

describe('Basket Promotion Component', () => {
  let component: BasketPromotionComponent;
  let fixture: ComponentFixture<BasketPromotionComponent>;
  let element: HTMLElement;
  let shoppingFacade: ShoppingFacade;

  beforeEach(async () => {
    shoppingFacade = mock(ShoppingFacade);

    const appFacade = mock(AppFacade);
    when(appFacade.icmBaseUrl).thenReturn('example.org');

    await TestBed.configureTestingModule({
      declarations: [
        BasketPromotionComponent,
        MockComponent(PromotionDetailsComponent),
        MockComponent(PromotionRemoveComponent),
        MockDirective(ServerHtmlDirective),
      ],
      providers: [{ provide: ShoppingFacade, useFactory: () => instance(shoppingFacade) }],
    }).compileComponents();
  });

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
      } as Promotion)
    );

    component.rebate = {
      promotionId: 'PROMO_UUID',
    } as BasketRebate;
    component.ngOnChanges();
    fixture.detectChanges();

    expect(element).toMatchInlineSnapshot(`
      <div>
        <div class="promotion-title" ng-reflect-ish-server-html="MyPromotionTitle"></div>
        <div class="promotion-details-and-remove-links">
          <ish-promotion-details></ish-promotion-details><ish-promotion-remove></ish-promotion-remove>
        </div>
      </div>
    `);
  });

  it('should not display the promotion if messages are disabled', () => {
    when(shoppingFacade.promotion$('PROMO_UUID')).thenReturn(
      of({
        id: 'PROMO_UUID',
        title: 'MyPromotionTitle',
        disableMessages: true,
      } as Promotion)
    );

    component.rebate = {
      promotionId: 'PROMO_UUID',
    } as BasketRebate;
    component.ngOnChanges();
    fixture.detectChanges();

    expect(element).toMatchInlineSnapshot(`N/A`);
  });
});
