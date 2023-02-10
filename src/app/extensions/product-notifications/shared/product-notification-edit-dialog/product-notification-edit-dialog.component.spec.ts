import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { AppFacade } from 'ish-core/facades/app.facade';
import { ProductContextFacade } from 'ish-core/facades/product-context.facade';

import { ProductNotificationsFacade } from '../../facades/product-notifications.facade';

import { ProductNotificationEditDialogComponent } from './product-notification-edit-dialog.component';

describe('Product Notification Edit Dialog Component', () => {
  let component: ProductNotificationEditDialogComponent;
  let fixture: ComponentFixture<ProductNotificationEditDialogComponent>;
  let element: HTMLElement;
  let context: ProductContextFacade;
  let productNotificationsFacade: ProductNotificationsFacade;
  let appFacade: AppFacade;

  beforeEach(async () => {
    context = mock(ProductContextFacade);
    productNotificationsFacade = mock(ProductNotificationsFacade);
    appFacade = mock(AppFacade);

    await TestBed.configureTestingModule({
      declarations: [ProductNotificationEditDialogComponent],
      providers: [
        { provide: AppFacade, useFactory: () => instance(appFacade) },
        { provide: ProductContextFacade, useFactory: () => instance(context) },
        { provide: ProductNotificationsFacade, useFactory: () => instance(productNotificationsFacade) },
      ],
      imports: [TranslateModule.forRoot()],
    }).compileComponents();

    when(appFacade.currentCurrency$).thenReturn(of('USD'));
    when(context.select('product', 'available')).thenReturn(of(true));
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
