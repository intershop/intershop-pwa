import { ComponentFixture, TestBed } from '@angular/core/testing';
import { instance, mock } from 'ts-mockito';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';

import { ProductNotificationEditDialogComponent } from './product-notification-edit-dialog.component';

describe('Product Notification Edit Dialog Component', () => {
  let component: ProductNotificationEditDialogComponent;
  let fixture: ComponentFixture<ProductNotificationEditDialogComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    const context = mock(ProductContextFacade);
    await TestBed.configureTestingModule({
      declarations: [ProductNotificationEditDialogComponent],
      providers: [{ provide: ProductContextFacade, useFactory: () => instance(context) }],
    }).compileComponents();
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
});
