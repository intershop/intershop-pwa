import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { PipesModule } from 'ish-core/pipes.module';
import { MockComponent } from 'ish-core/utils/dev/mock.component';

import { ProductPromotionComponent } from './product-promotion.component';

describe('Product Promotion Component', () => {
  let component: ProductPromotionComponent;
  let fixture: ComponentFixture<ProductPromotionComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MockComponent({
          selector: 'ish-promotion-details',
          template: 'Promotion Details Component',
          inputs: ['promotion'],
        }),
        ProductPromotionComponent,
      ],
      imports: [PipesModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductPromotionComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.promotions = [
      {
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
      },
    ];
    component.displayType = 'list';
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
