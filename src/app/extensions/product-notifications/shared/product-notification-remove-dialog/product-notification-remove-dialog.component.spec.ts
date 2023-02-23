import { ComponentFixture, TestBed } from '@angular/core/testing';
import { anything, instance, mock, verify, when } from 'ts-mockito';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';

import { ProductNotificationsFacade } from '../../facades/product-notifications.facade';
import { ProductNotification } from '../../models/product-notification/product-notification.model';

import { ProductNotificationRemoveDialogComponent } from './product-notification-remove-dialog.component';

describe('Product Notification Remove Dialog Component', () => {
  let component: ProductNotificationRemoveDialogComponent;
  let fixture: ComponentFixture<ProductNotificationRemoveDialogComponent>;
  let element: HTMLElement;
  let context: ProductContextFacade;
  let productNotificationsFacade: ProductNotificationsFacade;

  beforeEach(async () => {
    context = mock(ProductContextFacade);
    productNotificationsFacade = mock(ProductNotificationsFacade);
    await TestBed.configureTestingModule({
      providers: [
        { provide: ProductContextFacade, useFactory: () => instance(context) },
        { provide: ProductNotificationsFacade, useFactory: () => instance(productNotificationsFacade) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductNotificationRemoveDialogComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should emit delete product notification when according delete function is called', () => {
    const sku = '12345';
    component.productNotification = {
      id: '12345_price',
      type: 'price',
    } as ProductNotification;

    when(context.get('sku')).thenReturn(sku);

    when(productNotificationsFacade.deleteProductNotification(anything(), anything(), anything())).thenReturn();
    component.removeProductNotification();
    verify(
      productNotificationsFacade.deleteProductNotification(
        sku,
        component.productNotification.type,
        component.productNotification.id
      )
    ).once();
  });
});
