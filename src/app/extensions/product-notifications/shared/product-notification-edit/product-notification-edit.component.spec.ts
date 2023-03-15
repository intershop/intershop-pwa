import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { ProductContextFacade } from 'ish-core/facades/product-context.facade';

import { ProductNotificationEditDialogComponent } from '../product-notification-edit-dialog/product-notification-edit-dialog.component';

import { ProductNotificationEditComponent } from './product-notification-edit.component';

describe('Product Notification Edit Component', () => {
  let component: ProductNotificationEditComponent;
  let fixture: ComponentFixture<ProductNotificationEditComponent>;
  let element: HTMLElement;
  let context: ProductContextFacade;
  let accountFacade: AccountFacade;

  beforeEach(async () => {
    context = mock(ProductContextFacade);
    accountFacade = mock(accountFacade);

    await TestBed.configureTestingModule({
      declarations: [
        MockComponent(FaIconComponent),
        MockComponent(ProductNotificationEditDialogComponent),
        ProductNotificationEditComponent,
      ],
      providers: [
        { provide: AccountFacade, useFactory: () => instance(accountFacade) },
        { provide: ProductContextFacade, useFactory: () => instance(context) },
      ],
      imports: [TranslateModule.forRoot()],
    }).compileComponents();

    when(accountFacade.isLoggedIn$).thenReturn(of(true));
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

  it('should not show button when product is master or retail set', () => {
    when(context.select('displayProperties', 'addToNotification')).thenReturn(of(false));
    expect(element.querySelector('button')).toBeFalsy();
  });

  it('should include the custom notification modal dialog', () => {
    fixture.detectChanges();
    expect(element.querySelector('ish-product-notification-edit-dialog')).toBeTruthy();
  });

  it('should not show an icon when display type is not icon', () => {
    fixture.detectChanges();
    expect(element.querySelector('fa-icon')).toBeFalsy();
  });

  it('should show icon button when display type is icon', () => {
    when(context.select('displayProperties', 'addToNotification')).thenReturn(of(true));
    component.displayType = 'icon';
    fixture.detectChanges();
    expect(element.querySelector('fa-icon')).toBeTruthy();
  });

  it('should display price notification localization button text if the product is available', () => {
    when(context.select('product', 'available')).thenReturn(of(true));
    when(context.select('displayProperties', 'addToNotification')).thenReturn(of(true));
    fixture.detectChanges();
    expect(element.textContent).toContain('product.notification.price.notification.button.label');
  });

  it('should display stock notification localization button text if the product is not available', () => {
    when(context.select('product', 'available')).thenReturn(of(false));
    when(context.select('displayProperties', 'addToNotification')).thenReturn(of(true));
    fixture.detectChanges();
    expect(element.textContent).toContain('product.notification.stock.notification.button.label');
  });
});
