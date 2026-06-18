import { Directive, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { anything, instance, mock, verify, when } from 'ts-mockito';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';

import { OrderTemplatesFacade } from '../../../facades/order-templates.facade';
import { OrderTemplate } from '../../../models/order-template/order-template.model';
import { OrderTemplateAddToCartItemComponent } from '../order-template-add-to-cart-item/order-template-add-to-cart-item.component';

import { OrderTemplateAddToCartDialogComponent } from './order-template-add-to-cart-dialog.component';

@Directive({ selector: '[ishProductContext]', standalone: true })
class MockProductContextDirective {
  @Input() propagateIndex: unknown;
  @Input() quantity: unknown;
  @Input() sku: string;
}

describe('Order Template Add To Cart Dialog Component', () => {
  let component: OrderTemplateAddToCartDialogComponent;
  let fixture: ComponentFixture<OrderTemplateAddToCartDialogComponent>;
  let element: HTMLElement;
  let orderTemplatesFacade: OrderTemplatesFacade;
  let context: ProductContextFacade;
  let ngbModal: NgbModal;

  const orderTemplate: OrderTemplate = {
    id: '1',
    title: 'Test Template',
    itemsCount: 2,
    items: [
      { sku: 'SKU1', id: '1', creationDate: 0, desiredQuantity: { value: 2 } },
      { sku: 'SKU2', id: '2', creationDate: 0, desiredQuantity: { value: 5 } },
    ],
  };

  beforeEach(async () => {
    orderTemplatesFacade = mock(OrderTemplatesFacade);
    context = mock(ProductContextFacade);
    ngbModal = mock(NgbModal);

    when(orderTemplatesFacade.orderTemplates$).thenReturn(of([orderTemplate]));

    await TestBed.configureTestingModule({
      imports: [OrderTemplateAddToCartDialogComponent, TranslateModule.forRoot()],
    })
      .overrideComponent(OrderTemplateAddToCartDialogComponent, {
        set: {
          imports: [MockComponent(OrderTemplateAddToCartItemComponent), MockProductContextDirective, TranslateModule],
          providers: [
            { provide: ProductContextFacade, useFactory: () => instance(context) },
            { provide: OrderTemplatesFacade, useFactory: () => instance(orderTemplatesFacade) },
            { provide: NgbModal, useFactory: () => instance(ngbModal) },
          ],
        },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderTemplateAddToCartDialogComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('orderTemplate', orderTemplate);
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  describe('show', () => {
    it('should open modal', () => {
      const modalRef = { close: jest.fn() } as unknown as NgbModalRef;
      when(ngbModal.open(anything(), anything())).thenReturn(modalRef);

      fixture.detectChanges();
      component.show();

      expect(component.modal).toBeTruthy();
    });
  });

  describe('addToCart', () => {
    it('should call addToBasket on context and close the modal', () => {
      const modalRef = { close: jest.fn() } as unknown as NgbModalRef;
      component.modal = modalRef;

      component.addToCart();

      verify(context.addToBasket()).once();
      expect(modalRef.close).toHaveBeenCalled();
    });
  });

  describe('hide', () => {
    it('should close the modal if it exists', () => {
      const modalRef = { close: jest.fn() } as unknown as NgbModalRef;
      component.modal = modalRef;

      component.hide();

      expect(modalRef.close).toHaveBeenCalled();
    });

    it('should not throw if modal is not set', () => {
      expect(() => component.hide()).not.toThrow();
    });
  });
});
