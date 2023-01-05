import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { instance, mock } from 'ts-mockito';

import { ProductNotificationsFacade } from '../../facades/product-notifications.facade';

import { AccountProductNotificationsListComponent } from './account-product-notifications-list/account-product-notifications-list.component';
import { AccountProductNotificationsPageComponent } from './account-product-notifications-page.component';

describe('Account Product Notifications Page Component', () => {
  let component: AccountProductNotificationsPageComponent;
  let fixture: ComponentFixture<AccountProductNotificationsPageComponent>;
  let element: HTMLElement;
  const productNotificationsFacade = mock(ProductNotificationsFacade);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, TranslateModule.forRoot()],
      declarations: [AccountProductNotificationsPageComponent, MockComponent(AccountProductNotificationsListComponent)],
      providers: [{ provide: ProductNotificationsFacade, useFactory: () => instance(productNotificationsFacade) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountProductNotificationsPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
