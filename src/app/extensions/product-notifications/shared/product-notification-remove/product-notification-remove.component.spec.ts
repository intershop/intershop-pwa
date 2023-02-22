import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { ProductNotificationRemoveDialogComponent } from '../product-notification-remove-dialog/product-notification-remove-dialog.component';

import { ProductNotificationRemoveComponent } from './product-notification-remove.component';

describe('Product Notification Remove Component', () => {
  let component: ProductNotificationRemoveComponent;
  let fixture: ComponentFixture<ProductNotificationRemoveComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        MockComponent(FaIconComponent),
        MockComponent(ProductNotificationRemoveDialogComponent),
        ProductNotificationRemoveComponent,
      ],
      imports: [TranslateModule.forRoot()],
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

  it('should include the custom notification modal dialog', () => {
    fixture.detectChanges();
    expect(element.querySelector('ish-product-notification-remove-dialog')).toBeTruthy();
  });
});
