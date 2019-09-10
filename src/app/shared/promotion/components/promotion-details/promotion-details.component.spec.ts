import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { configurationReducer } from 'ish-core/store/configuration/configuration.reducer';
import { ModalDialogLinkComponent } from '../../../../shared/common/components/modal-dialog-link/modal-dialog-link.component';

import { PromotionDetailsComponent } from './promotion-details.component';

describe('Promotion Details Component', () => {
  let component: PromotionDetailsComponent;
  let fixture: ComponentFixture<PromotionDetailsComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MockComponent(ModalDialogLinkComponent), PromotionDetailsComponent, ServerHtmlDirective],
      imports: [
        RouterTestingModule,
        StoreModule.forRoot({ configuration: configurationReducer }),
        TranslateModule.forRoot(),
      ],
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
    expect(element.querySelector('ish-modal-dialog-link')).toBeTruthy();
  });
});
