import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

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
  let form: UntypedFormGroup;

  beforeEach(async () => {
    context = mock(ProductContextFacade);
    productNotificationsFacade = mock(ProductNotificationsFacade);
    appFacade = mock(AppFacade);

    await TestBed.configureTestingModule({
      declarations: [ProductNotificationEditDialogComponent],
      providers: [
        { provide: AppFacade, useFactory: () => instance(appFacade) },
        { provide: ProductContextFacade, useFactory: () => instance(context) },
        { provide: ProductNotificationsFacade, useFactory: () => instance(productNotificationsFacade) },
      ],
      imports: [FormlyTestingModule, TranslateModule.forRoot()],
    }).compileComponents();

    when(appFacade.currentCurrency$).thenReturn(of('USD'));
    when(context.select('product', 'available')).thenReturn(of(true));
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductNotificationEditDialogComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    fb = TestBed.inject(UntypedFormBuilder);

    form = fb.group({
      alerttype: ['price'],
      email: ['jlink@test.intershop.de', [Validators.required]],
      pricevalue: ['1000', [SpecialValidators.moneyAmount]],
    });

    component.productNotificationForm = form;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should submit a valid form when the user fills all required fields', () => {
    fixture.detectChanges();

    expect(component.formDisabled).toBeFalse();
    component.submitForm();
    expect(component.formDisabled).toBeFalse();
  });

  it('should not submit a form when the user does not provide money format for price notification', () => {
    component.productNotificationForm = fb.group({
      pricevalue: ['abc', [SpecialValidators.moneyAmount]],
    });

    fixture.detectChanges();

    expect(component.formDisabled).toBeFalse();
    component.submitForm();
    expect(component.formDisabled).toBeTrue();
  });
});
