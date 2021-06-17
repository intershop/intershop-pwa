import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockDirective } from 'ng-mocks';
import { instance, mock, when } from 'ts-mockito';

import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { FeatureToggleService } from 'ish-core/feature-toggle.module';
import { OrderListComponent } from 'ish-shared/components/order/order-list/order-list.component';

import { LazyHierarchyOrderListComponent } from '../../extensions/organization-hierarchies/exports/lazy-hierarchy-order-list/lazy-hierarchy-order-list.component';

import { AccountOrderHistoryPageComponent } from './account-order-history-page.component';

describe('Account Order History Page Component', () => {
  let component: AccountOrderHistoryPageComponent;
  let fixture: ComponentFixture<AccountOrderHistoryPageComponent>;
  let element: HTMLElement;
  let featureToggleService: FeatureToggleService;

  beforeEach(async () => {
    featureToggleService = mock(FeatureToggleService);
    await TestBed.configureTestingModule({
      declarations: [
        AccountOrderHistoryPageComponent,
        MockComponent(LazyHierarchyOrderListComponent),
        MockComponent(OrderListComponent),
        MockDirective(ServerHtmlDirective),
      ],
      imports: [TranslateModule.forRoot()],
      providers: [{ provide: FeatureToggleService, useFactory: () => instance(featureToggleService) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountOrderHistoryPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render order list component on page', () => {
    fixture.detectChanges();
    expect(element.querySelector('ish-order-list')).toBeTruthy();
    expect(element.querySelector('ish-lazy-hierarchy-order-list')).toBeFalsy();
  });

  it('should render lazy hierarchy order list component on page when feature is enabled', () => {
    when(featureToggleService.enabled('organizationHierarchies')).thenReturn(true);
    fixture.detectChanges();
    expect(element.querySelector('ish-lazy-hierarchy-order-list')).toBeTruthy();
    expect(element.querySelector('ish-order-list')).toBeFalsy();
  });
});
