import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { combineReducers } from '@ngrx/store';
import { MockComponent } from 'ng-mocks';

import { checkoutReducers } from 'ish-core/store/checkout/checkout-store.module';
import { shoppingReducers } from 'ish-core/store/shopping/shopping-store.module';
import { ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';
import { MiniBasketComponent } from 'ish-shell/header/components/mini-basket/mini-basket.component';

import { MiniBasketContainerComponent } from './mini-basket.container';

describe('Mini Basket Container', () => {
  let component: MiniBasketContainerComponent;
  let fixture: ComponentFixture<MiniBasketContainerComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MiniBasketContainerComponent, MockComponent(MiniBasketComponent)],
      imports: [
        RouterTestingModule,
        ngrxTesting({
          reducers: { shopping: combineReducers(shoppingReducers), checkout: combineReducers(checkoutReducers) },
        }),
      ],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(MiniBasketContainerComponent);
        component = fixture.componentInstance;
        element = fixture.nativeElement;
      });
  }));

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
