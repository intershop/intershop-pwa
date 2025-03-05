import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UntypedFormBuilder } from '@angular/forms';
import { of } from 'rxjs';
import { anything, instance, mock, verify, when } from 'ts-mockito';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { AppFacade } from 'ish-core/facades/app.facade';
import { ProductContextFacade } from 'ish-core/facades/product-context.facade';

import { ProductNotificationsFacade } from '../../facades/product-notifications.facade';

import { ProductNotificationEditDialogComponent } from './product-notification-edit-dialog.component';

describe('Product Notification Edit Dialog Component', () => {
  let component: ProductNotificationEditDialogComponent;
  let fixture: ComponentFixture<ProductNotificationEditDialogComponent>;
  let element: HTMLElement;
  let context: ProductContextFacade;
  let productNotificationsFacade: ProductNotificationsFacade;
  let accountFacade: AccountFacade;
  let appFacade: AppFacade;
  let fb: UntypedFormBuilder;

  beforeEach(async () => {
    context = mock(ProductContextFacade);
    productNotificationsFacade = mock(ProductNotificationsFacade);
    accountFacade = mock(accountFacade);
    appFacade = mock(AppFacade);

    await TestBed.configureTestingModule({
      providers: [
        { provide: AccountFacade, useFactory: () => instance(accountFacade) },
        { provide: AppFacade, useFactory: () => instance(appFacade) },
        { provide: ProductContextFacade, useFactory: () => instance(context) },
        { provide: ProductNotificationsFacade, useFactory: () => instance(productNotificationsFacade) },
      ],
    }).compileComponents();

    when(appFacade.currentCurrency$).thenReturn(of('USD'));
    when(context.select('product', 'available')).thenReturn(of(true));
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductNotificationEditDialogComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  describe('form submit', () => {
    beforeEach(() => {
      fb = TestBed.inject(UntypedFormBuilder);
    });

    it('should emit delete product notification when alert type is delete', () => {
      component.productNotificationForm = fb.group({
        alertType: ['delete'],
      });

      when(productNotificationsFacade.deleteProductNotification(anything(), anything(), anything())).thenReturn();
      component.submitForm();
      verify(productNotificationsFacade.deleteProductNotification(anything(), anything(), anything())).once();
    });

    it('should emit update product notification when alert type is price', () => {
      component.productNotificationForm = fb.group({
        alertType: ['price'],
      });

      when(productNotificationsFacade.updateProductNotification(anything(), anything())).thenReturn();
      component.submitForm();
      verify(productNotificationsFacade.updateProductNotification(anything(), anything())).once();
    });

    it('should emit update product notification when alert type is stock', () => {
      component.productNotificationForm = fb.group({
        alertType: ['stock'],
      });

      when(productNotificationsFacade.updateProductNotification(anything(), anything())).thenReturn();
      component.submitForm();
      verify(productNotificationsFacade.updateProductNotification(anything(), anything())).once();
    });

    it('should emit create product notification when alert type is not set', () => {
      component.productNotificationForm = fb.group({
        alertType: undefined,
      });

      when(productNotificationsFacade.createProductNotification(anything())).thenReturn();
      component.submitForm();
      verify(productNotificationsFacade.createProductNotification(anything())).once();
    });
  });
});
