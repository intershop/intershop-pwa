import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { PipesModule } from 'ish-core/pipes.module';
import { ModalDialogComponent } from '../../../../shared/common/components/modal-dialog/modal-dialog.component';

import { PromotionDetailsComponent } from './promotion-details.component';

describe('Promotion Details Component', () => {
  let component: PromotionDetailsComponent;
  let fixture: ComponentFixture<PromotionDetailsComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MockComponent(ModalDialogComponent), PromotionDetailsComponent],
      imports: [PipesModule, TranslateModule.forRoot()],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromotionDetailsComponent);
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

  it('should display the details link for a promotion', () => {
    expect(element.querySelector('.details-link')).toBeTruthy();
    expect(element.querySelector('.promotion-details-link')).toBeTruthy();
    expect(element.querySelector('a')).toBeTruthy();
  });
});
