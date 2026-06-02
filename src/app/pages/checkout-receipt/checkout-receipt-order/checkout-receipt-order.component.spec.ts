import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { MockComponent, MockDirective, MockPipe } from 'ng-mocks';

import { LazyLoadingContentDirective } from 'ish-core/directives/lazy-loading-content.directive';
import { BasketMockData } from 'ish-core/utils/dev/basket-mock-data';
import { ContentIncludeComponent } from 'ish-shared/cms/components/content-include/content-include.component';
import { ModalDialogLinkComponent } from 'ish-shared/components/common/modal-dialog-link/modal-dialog-link.component';

import { CheckoutReceiptOrderComponent } from './checkout-receipt-order.component';

describe('Checkout Receipt Order Component', () => {
  let component: CheckoutReceiptOrderComponent;
  let fixture: ComponentFixture<CheckoutReceiptOrderComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckoutReceiptOrderComponent, TranslateModule.forRoot()],
      providers: [provideRouter([])],
    })
      .overrideComponent(CheckoutReceiptOrderComponent, {
        remove: {
          imports: [TranslatePipe, ModalDialogLinkComponent, ContentIncludeComponent, LazyLoadingContentDirective],
        },
        add: {
          imports: [
            MockPipe(TranslatePipe),
            MockComponent(ModalDialogLinkComponent),
            MockComponent(ContentIncludeComponent),
            MockDirective(LazyLoadingContentDirective),
          ],
        },
      })
      .compileComponents();
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
