import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';

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
      imports: [NgbNavModule, RouterTestingModule, TranslateModule.forRoot()],
      declarations: [
        AccountProductNotificationsPageComponent,
        MockComponent(AccountProductNotificationsListComponent),
        MockComponent(LoadingComponent),
      ],
      providers: [{ provide: ProductNotificationsFacade, useFactory: () => instance(productNotificationsFacade) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountProductNotificationsPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    when(productNotificationsFacade.productNotificationType$).thenReturn(of('price'));
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display loading overlay if product notifications are loading', () => {
    when(productNotificationsFacade.productNotificationsLoading$).thenReturn(of(true));
    fixture.detectChanges();
    expect(element.querySelector('ish-loading')).toBeTruthy();
  });

  it('should display price notifactions tab as active', () => {
    fixture.detectChanges();
    expect(element.querySelector('[data-testing-id=tab-link-notifications-price]').getAttribute('class')).toContain(
      'active'
    );
  });
});
