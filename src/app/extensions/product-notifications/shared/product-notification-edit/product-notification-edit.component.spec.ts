import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductNotificationEditComponent } from './ProductNotificationEditComponent';

describe('Product Notification Edit Component', () => {
  let component: ProductNotificationEditComponent;
  let fixture: ComponentFixture<ProductNotificationEditComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductNotificationEditComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductNotificationEditComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
