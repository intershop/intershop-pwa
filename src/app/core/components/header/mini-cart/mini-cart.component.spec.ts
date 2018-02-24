import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { instance, mock } from 'ts-mockito';
import { CartStatusService } from '../../../services/cart-status/cart-status.service';
import { MiniCartComponent } from './mini-cart.component';

describe('Mini Cart Component', () => {
  let fixture: ComponentFixture<MiniCartComponent>;
  let component: MiniCartComponent;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MiniCartComponent
      ],
      providers: [
        { provide: CartStatusService, useFactory: () => instance(mock(CartStatusService)) }
      ],
      imports: [],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(MiniCartComponent);
      component = fixture.componentInstance;
      element = fixture.nativeElement;
    });
  }));

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(function() { fixture.detectChanges(); }).not.toThrow();
  });

  xit('should call calculateCartValues and verify if the correct calculations are made', () => {
    const cartItems = [
      {
        salePrice: {
          'value': 20
        }
      },
      {
        salePrice: {
          'value': 40
        }
      },
    ];
    component.calculateCartValues(cartItems);
    expect(component.cartPrice).toEqual(60);
    expect(component.cartLength).toEqual(2);
  });

});
