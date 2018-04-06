import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { Basket } from '../../../../models/basket/basket.model';
import { MiniCartComponent } from './mini-cart.component';

describe('Mini Cart Component', () => {
  let fixture: ComponentFixture<MiniCartComponent>;
  let component: MiniCartComponent;
  let element: HTMLElement;
  let basket: Basket;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CollapseModule.forRoot(),
        CommonModule,
        TranslateModule.forRoot(),
      ],
      declarations: [
        MiniCartComponent
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MiniCartComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    basket = {
      id: '4711',
      lineItems: [],
      purchaseCurrency: 'USD',
      totals: {
        itemTotal: {
          value: 0,
          currencyMnemonic: 'USD',
          type: 'Money',
        },
        basketTotal: {
          value: 0,
          currencyMnemonic: 'USD',
          type: 'Money',
        },
        taxTotal: {
          value: 0,
          currencyMnemonic: 'USD',
          type: 'Money',
        }
      }
    };
  });

  it('should be created', () => {
    component.basket = basket;
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
