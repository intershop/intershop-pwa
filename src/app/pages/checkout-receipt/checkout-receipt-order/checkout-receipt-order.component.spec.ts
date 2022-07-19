import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { BasketMockData } from 'ish-core/utils/dev/basket-mock-data';
import { ModalDialogLinkComponent } from 'ish-shared/components/common/modal-dialog-link/modal-dialog-link.component';

import { CheckoutReceiptOrderComponent } from './checkout-receipt-order.component';

describe('Checkout Receipt Order Component', () => {
  let component: CheckoutReceiptOrderComponent;
  let fixture: ComponentFixture<CheckoutReceiptOrderComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CheckoutReceiptOrderComponent, MockComponent(ModalDialogLinkComponent)],
      imports: [RouterTestingModule, TranslateModule.forRoot()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutReceiptOrderComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.order = BasketMockData.getOrder();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display the document number after creation', () => {
    fixture.detectChanges();
    expect(element.querySelector('[data-testing-id="order-document-number"]').innerHTML.trim()).toContain('12345678');
  });
});
