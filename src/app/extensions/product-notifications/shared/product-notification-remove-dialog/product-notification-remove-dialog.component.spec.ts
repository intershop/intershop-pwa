import { ComponentFixture, TestBed } from '@angular/core/testing';
import { instance, mock } from 'ts-mockito';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';

import { ProductNotificationsFacade } from '../../facades/product-notifications.facade';

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
      declarations: [ProductNotificationRemoveDialogComponent],
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
});
