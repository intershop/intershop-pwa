import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { ProductNotificationDialogComponent } from '../product-notification-dialog/product-notification-dialog.component';

import { ProductNotificationEditComponent } from './product-notification-edit.component';

describe('Product Notification Edit Component', () => {
  let component: ProductNotificationEditComponent;
  let fixture: ComponentFixture<ProductNotificationEditComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        MockComponent(FaIconComponent),
        MockComponent(ProductNotificationDialogComponent),
        ProductNotificationEditComponent,
      ],
      imports: [TranslateModule.forRoot()],
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
