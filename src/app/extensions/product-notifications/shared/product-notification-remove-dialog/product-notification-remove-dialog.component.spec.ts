import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductNotificationRemoveDialogComponent } from './product-notification-remove-dialog.component';

describe('ProductNotificationRemoveDialogComponent', () => {
  let component: ProductNotificationRemoveDialogComponent;
  let fixture: ComponentFixture<ProductNotificationRemoveDialogComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductNotificationRemoveDialogComponent],
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
