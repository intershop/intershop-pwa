import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent, MockDirective } from 'ng-mocks';
import { EMPTY, of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { Promotion } from 'ish-core/models/promotion/promotion.model';
import { PromotionDetailsComponent } from 'ish-shared/components/promotion/promotion-details/promotion-details.component';

import { ProductPromotionComponent } from './product-promotion.component';

describe('Product Promotion Component', () => {
  let component: ProductPromotionComponent;
  let fixture: ComponentFixture<ProductPromotionComponent>;
  let element: HTMLElement;
  let context: ProductContextFacade;

  beforeEach(async () => {
    context = mock(ProductContextFacade);
    when(context.select('displayProperties', 'promotions')).thenReturn(of(true));
    when(context.select('promotions')).thenReturn(EMPTY);

    await TestBed.configureTestingModule({
      declarations: [
        MockComponent(PromotionDetailsComponent),
        MockDirective(ServerHtmlDirective),
        ProductPromotionComponent,
      ],
      providers: [{ provide: ProductContextFacade, useFactory: () => instance(context) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductPromotionComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display the promotion when supplied', () => {
    when(context.select('promotions')).thenReturn(
      of([
        {
          id: 'PROMO_UUID',
          title: 'MyPromotion',
          disableMessages: false,
        } as Promotion,
      ])
    );
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
