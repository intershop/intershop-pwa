import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormlyTestingModule } from 'ish-shared/formly/dev/testing/formly-testing.module';

import { ProductNotificationEditFormComponent } from './product-notification-edit-form.component';

describe('Product Notification Edit Form Component', () => {
  let component: ProductNotificationEditFormComponent;
  let fixture: ComponentFixture<ProductNotificationEditFormComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormlyTestingModule],
      declarations: [ProductNotificationEditFormComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductNotificationEditFormComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
