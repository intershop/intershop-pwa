import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { of } from 'rxjs';
import { anything, instance, mock, verify, when } from 'ts-mockito';

import { AppFacade } from 'ish-core/facades/app.facade';
import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { FormlyTestingModule } from 'ish-shared/formly/dev/testing/formly-testing.module';
import { SpecialValidators } from 'ish-shared/forms/validators/special-validators';

import { ProductNotificationsFacade } from '../../facades/product-notifications.facade';

import { ProductNotificationEditDialogComponent } from './product-notification-edit-dialog.component';

describe('Product Notification Edit Dialog Component', () => {
  let component: ProductNotificationEditDialogComponent;
  let fixture: ComponentFixture<ProductNotificationEditDialogComponent>;
  let element: HTMLElement;
  let context: ProductContextFacade;
  let productNotificationsFacade: ProductNotificationsFacade;
  let appFacade: AppFacade;
  let fb: UntypedFormBuilder;

  beforeEach(async () => {
    context = mock(ProductContextFacade);
    productNotificationsFacade = mock(ProductNotificationsFacade);
    appFacade = mock(AppFacade);

    await TestBed.configureTestingModule({
      providers: [
        { provide: AppFacade, useFactory: () => instance(appFacade) },
        { provide: ProductContextFacade, useFactory: () => instance(context) },
        { provide: ProductNotificationsFacade, useFactory: () => instance(productNotificationsFacade) },
      ],
      imports: [FormlyTestingModule],
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

    it('should submit a valid form when the user fills all required fields', () => {
      component.productNotificationForm = fb.group({
        alerttype: ['price'],
        email: ['jlink@test.intershop.de', [Validators.required, SpecialValidators.email]],
        pricevalue: [1000, [SpecialValidators.moneyAmount]],
      });

      expect(component.formDisabled).toBeFalse();
      component.submitForm();
      expect(component.formDisabled).toBeFalse();
    });

    it('should not submit a form when the user does not provide money format for price notification', () => {
      component.productNotificationForm = fb.group({
        pricevalue: ['abc', [SpecialValidators.moneyAmount]],
      });

      expect(component.formDisabled).toBeFalse();
      component.submitForm();
      expect(component.formDisabled).toBeTrue();
    });

    it('should emit delete product notification when alert type is delete', () => {
      component.productNotificationForm = fb.group({
        alerttype: ['delete'],
      });

      when(productNotificationsFacade.deleteProductNotification(anything(), anything(), anything())).thenReturn();
      component.submitForm();
      verify(productNotificationsFacade.deleteProductNotification(anything(), anything(), anything())).once();
    });

    it('should emit update product notification when alert type is price', () => {
      component.productNotificationForm = fb.group({
        alerttype: ['price'],
      });

      when(productNotificationsFacade.updateProductNotification(anything(), anything())).thenReturn();
      component.submitForm();
      verify(productNotificationsFacade.updateProductNotification(anything(), anything())).once();
    });

    it('should emit update product notification when alert type is stock', () => {
      component.productNotificationForm = fb.group({
        alerttype: ['stock'],
      });

      when(productNotificationsFacade.updateProductNotification(anything(), anything())).thenReturn();
      component.submitForm();
      verify(productNotificationsFacade.updateProductNotification(anything(), anything())).once();
    });

    it('should emit create product notification when alert type is not set', () => {
      component.productNotificationForm = fb.group({
        alerttype: undefined,
      });

      when(productNotificationsFacade.createProductNotification(anything())).thenReturn();
      component.submitForm();
      verify(productNotificationsFacade.createProductNotification(anything())).once();
    });
  });
});
