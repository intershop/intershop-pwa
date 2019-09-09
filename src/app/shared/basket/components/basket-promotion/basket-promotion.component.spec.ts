import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule } from '@ngrx/store';
import { MockComponent } from 'ng-mocks';

import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { configurationReducer } from 'ish-core/store/configuration/configuration.reducer';

import { PromotionDetailsComponent } from '../../../promotion/components/promotion-details/promotion-details.component';

import { BasketPromotionComponent } from './basket-promotion.component';

describe('Basket Promotion Component', () => {
  let component: BasketPromotionComponent;
  let fixture: ComponentFixture<BasketPromotionComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BasketPromotionComponent, MockComponent(PromotionDetailsComponent), ServerHtmlDirective],
      imports: [RouterTestingModule, StoreModule.forRoot({ configuration: configurationReducer })],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasketPromotionComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.promotion = {
      id: 'PROMO_UUID',
      name: 'MyPromotion',
      couponCodeRequired: false,
      currency: 'EUR',
      promotionType: 'MyPromotionType',
      description: 'MyPromotionDescription',
      legalContentMessage: 'MyPromotionContentMessage',
      longTitle: 'MyPromotionLongTitle',
      ruleDescription: 'MyPromotionRuleDescription',
      title: 'MyPromotionTitle',
      useExternalUrl: false,
      disableMessages: false,
    };
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display the promotion title for the given promotion', () => {
    expect(element.querySelector('.promotion-title').textContent).toContain(component.promotion.title);
  });
});
