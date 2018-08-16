import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { User } from '../../../../models/user/user.model';
import { BasketMockData } from '../../../../utils/dev/basket-mock-data';
import { MockComponent } from '../../../../utils/dev/mock.component';

import { CheckoutReceiptComponent } from './checkout-receipt.component';

describe('Checkout Receipt Component', () => {
  let component: CheckoutReceiptComponent;
  let fixture: ComponentFixture<CheckoutReceiptComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CheckoutReceiptComponent,
        MockComponent({
          selector: 'ish-basket-cost-summary',
          template: 'Basket Cost Summary Component',
          inputs: ['totals'],
        }),
        MockComponent({
          selector: 'ish-info-box',
          template: 'Checkout Infobox Component',
          inputs: ['heading'],
        }),
        MockComponent({
          selector: 'ish-address',
          template: 'Address Component',
          inputs: ['address'],
        }),
        MockComponent({
          selector: 'ish-line-item-list',
          template: 'Line Item List Component',
          inputs: ['lineItems', 'editable'],
        }),
      ],
      imports: [TranslateModule.forRoot()],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutReceiptComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.order = BasketMockData.getOrder();
    component.user = { email: 'test@test.com' } as User;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display the document number after creation', () => {
    fixture.detectChanges();
    expect(element.querySelector('strong[data-testing-id="order-document-number"]').innerHTML).toEqual('12345678');
  });

  it('should display the home link after creation', () => {
    fixture.detectChanges();
    expect(element.querySelector('a[data-testing-id="home-link"]')).toBeTruthy();
  });

  it('should display the my account link after creation', () => {
    fixture.detectChanges();
    expect(element.querySelector('a[data-testing-id="myaccount-link"]')).toBeTruthy();
  });
});
