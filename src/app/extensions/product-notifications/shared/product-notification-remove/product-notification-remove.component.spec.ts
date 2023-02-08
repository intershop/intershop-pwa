import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductNotificationRemoveComponent } from './product-notification-remove.component';

describe('Product Notification Remove Component', () => {
  let component: ProductNotificationRemoveComponent;
  let fixture: ComponentFixture<ProductNotificationRemoveComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductNotificationRemoveComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductNotificationRemoveComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
