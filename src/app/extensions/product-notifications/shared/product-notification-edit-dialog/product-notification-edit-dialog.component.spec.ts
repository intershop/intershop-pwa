import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, UntypedFormBuilder } from '@angular/forms';
import { TranslatePipe, provideTranslateService } from '@ngx-translate/core';
import { MockComponent, MockDirective } from 'ng-mocks';
import { of } from 'rxjs';
import { anything, instance, mock, verify, when } from 'ts-mockito';

import { FormSubmitDirective } from 'ish-core/directives/form-submit.directive';
import { AccountFacade } from 'ish-core/facades/account.facade';
import { AppFacade } from 'ish-core/facades/app.facade';
import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { ProductView } from 'ish-core/models/product-view/product-view.model';
import { ModalDialogComponent } from 'ish-shared/components/common/modal-dialog/modal-dialog.component';
import { ProductImageComponent } from 'ish-shared/components/product/product-image/product-image.component';

import { ProductNotificationsFacade } from '../../facades/product-notifications.facade';
import { ProductNotificationEditFormComponent } from '../product-notification-edit-form/product-notification-edit-form.component';

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
      imports: [ReactiveFormsModule, TranslatePipe],
      declarations: [
        MockComponent(ModalDialogComponent),
        MockComponent(ProductImageComponent),
        MockComponent(ProductNotificationEditFormComponent),
        MockDirective(FormSubmitDirective),
        ProductNotificationEditDialogComponent,
      ],
      providers: [
        { provide: AccountFacade, useFactory: () => instance(accountFacade) },
        { provide: AppFacade, useFactory: () => instance(appFacade) },
        { provide: ProductContextFacade, useFactory: () => instance(context) },
        { provide: ProductNotificationsFacade, useFactory: () => instance(productNotificationsFacade) },
        provideTranslateService(),
      ],
    }).compileComponents();

    when(appFacade.currentCurrency$).thenReturn(of('USD'));
    when(context.select('product')).thenReturn(of({ name: 'Test Product' } as ProductView));
    when(context.select('inventory', 'inStock')).thenReturn(of(true));
    when(accountFacade.userEmail$).thenReturn(of('test@test.com'));
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
      fixture.detectChanges();
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
