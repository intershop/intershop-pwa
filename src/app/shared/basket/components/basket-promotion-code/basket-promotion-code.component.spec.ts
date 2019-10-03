import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap';
import { combineReducers } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { checkoutReducers } from 'ish-core/store/checkout/checkout-store.module';
import { shoppingReducers } from 'ish-core/store/shopping/shopping-store.module';
import { ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';

import { BasketPromotionCodeComponent } from './basket-promotion-code.component';

describe('Basket Promotion Code Component', () => {
  let component: BasketPromotionCodeComponent;
  let fixture: ComponentFixture<BasketPromotionCodeComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        TranslateModule.forRoot(),
        ngrxTesting({
          reducers: {
            shopping: combineReducers(shoppingReducers),
            checkout: combineReducers(checkoutReducers),
          },
        }),
      ],
      declarations: [BasketPromotionCodeComponent, MockComponent(NgbCollapse)],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasketPromotionCodeComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display the link, input field and the apply button on component', () => {
    expect(element.querySelector('a[data-testing-id=promo-collapse-link]')).toBeTruthy();
    expect(element.querySelector('input')).toBeTruthy();
    expect(element.querySelector('button')).toBeTruthy();
  });
});
