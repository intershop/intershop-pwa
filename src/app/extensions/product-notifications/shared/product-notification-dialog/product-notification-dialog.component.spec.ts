import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductNotificationDialogComponent } from './product-notification-dialog.component';

describe('Product Notification Dialog Component', () => {
  let component: ProductNotificationDialogComponent;
  let fixture: ComponentFixture<ProductNotificationDialogComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductNotificationDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductNotificationDialogComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
