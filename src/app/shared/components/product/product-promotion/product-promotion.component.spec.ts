import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { MockComponent, MockDirective } from 'ng-mocks';
import { EMPTY, of } from 'rxjs';
import { anything, instance, mock, when } from 'ts-mockito';

import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { Product } from 'ish-core/models/product/product.model';
import { Promotion } from 'ish-core/models/promotion/promotion.model';
import { PromotionDetailsComponent } from 'ish-shared/components/promotion/promotion-details/promotion-details.component';

import { ProductPromotionComponent } from './product-promotion.component';

describe('Product Promotion Component', () => {
  let component: ProductPromotionComponent;
  let fixture: ComponentFixture<ProductPromotionComponent>;
  let element: HTMLElement;
  let shoppingFacade: ShoppingFacade;

  beforeEach(async(() => {
    shoppingFacade = mock(ShoppingFacade);
    when(shoppingFacade.promotions$(anything())).thenReturn(EMPTY);

    TestBed.configureTestingModule({
      declarations: [
        MockComponent(PromotionDetailsComponent),
        MockDirective(ServerHtmlDirective),
        ProductPromotionComponent,
      ],
      providers: [{ provide: ShoppingFacade, useFactory: () => instance(shoppingFacade) }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductPromotionComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.product = {
      promotionIds: ['PROMO_UUID'],
    } as Product;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => component.ngOnChanges()).not.toThrow();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display the promotion when supplied', () => {
    when(shoppingFacade.promotions$(anything())).thenReturn(
      of([
        {
          id: 'PROMO_UUID',
          title: 'MyPromotion',
          disableMessages: false,
        } as Promotion,
      ])
    );
    component.ngOnChanges();
    fixture.detectChanges();

    expect(element).toMatchInlineSnapshot(`
      <ul class="promotion-list">
        <li class="promotion-list-item">
          <div class="promotion-short-title" ng-reflect-ish-server-html="MyPromotion"></div>
          <br />
          <div><ish-promotion-details></ish-promotion-details></div>
        </li>
      </ul>
    `);
  });
});
