import { ChangeDetectionStrategy, Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { DeviceType } from 'ish-core/models/viewtype/viewtype.types';

interface NavigationItems {
  [link: string]: {
    localizationKey: string;
    dataTestingId?: string;
    feature?: string;
    children?: NavigationItems;
  };
}

@Component({
  selector: 'ish-account-navigation',
  templateUrl: './account-navigation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountNavigationComponent implements OnInit, OnChanges, OnDestroy {
  @Input() deviceType: DeviceType;

  isMobileView = false;
  isBusinessCustomer: boolean;
  private destroy$ = new Subject();

  /**
   * Manages the Account Navigation items.
   */
  navigationItems: NavigationItems = {
    '/account': { localizationKey: 'account.my_account.link' },
    '/account/orders': { localizationKey: 'account.order_history.link' },
    '/account/wishlists': {
      localizationKey: 'account.wishlists.link',
      feature: 'wishlists',
      dataTestingId: 'wishlists-link',
    },
    '/account/order-templates': {
      localizationKey: 'account.ordertemplates.link',
      feature: 'orderTemplates',
      dataTestingId: 'order-templates-link',
    },
    '/account/payment': { localizationKey: 'account.payment.link', dataTestingId: 'payments-link' },
    '/account/addresses': { localizationKey: 'account.saved_addresses.link', dataTestingId: 'addresses-link' },
    '/account/profile': { localizationKey: 'account.profile.link' },
    '/account/quotes': { localizationKey: 'account.navigation.quotes.link', feature: 'quoting' },
    /* TODO: organize as sub menu
      '/account/organization': {
      localizationKey: 'My Organization',
      children: { '/users': { localizationKey: 'account.organization.user_management' } },
    },*/
    '/account/organization': { localizationKey: 'account.organization.user_management' },
    '/logout': { localizationKey: 'account.navigation.logout.link' },
  };

  constructor(private router: Router, private accountFacade: AccountFacade) {}

  ngOnInit() {
    this.isMobileView = this.deviceType === 'tablet' || this.deviceType === 'mobile';
    this.accountFacade.isBusinessCustomer$.pipe(takeUntil(this.destroy$)).subscribe(x => (this.isBusinessCustomer = x));
    this.initNavigationItems();
  }

  ngOnChanges() {
    this.isMobileView = this.deviceType === 'tablet' || this.deviceType === 'mobile';
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  initNavigationItems() {
    this.navigationItems = {
      '/account': { localizationKey: 'account.my_account.link' },
      '/account/orders': { localizationKey: 'account.order_history.link' },
      '/account/wishlists': {
        localizationKey: 'account.wishlists.link',
        feature: 'wishlists',
        dataTestingId: 'wishlists-link',
      },
      '/account/payment': { localizationKey: 'account.payment.link', dataTestingId: 'payments-link' },
      '/account/addresses': { localizationKey: 'account.saved_addresses.link', dataTestingId: 'addresses-link' },
      '/account/profile': { localizationKey: 'account.profile.link' },
      '/account/quotes': { localizationKey: 'account.navigation.quotes.link', feature: 'quoting' },
      /* TODO: organize as sub menu
        '/account/organization': {
        localizationKey: 'My Organization',
        children: { '/users': { localizationKey: 'account.organization.user_management' } },
      },*/
      ...(this.isBusinessCustomer
        ? { '/account/organization': { localizationKey: 'account.organization.user_management' } }
        : {}),
      '/logout': { localizationKey: 'account.navigation.logout.link' },
    };
  }

  get currentPath() {
    return location.pathname;
  }

  navigateTo(link) {
    if (link) {
      this.router.navigate([link]);
    }
  }

  get unsorted() {
    return () => 0;
  }
}
