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
});
