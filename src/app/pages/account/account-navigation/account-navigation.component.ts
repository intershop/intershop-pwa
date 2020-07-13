import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { DeviceType } from 'ish-core/models/viewtype/viewtype.types';

interface NavigationItems {
  [link: string]: {
    localizationKey: string;
    dataTestingId?: string;
    feature?: string;
    permission?: string;
    children?: NavigationItems;
  };
}

@Component({
  selector: 'ish-account-navigation',
  templateUrl: './account-navigation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountNavigationComponent implements OnInit, OnChanges {
  @Input() deviceType: DeviceType;

  isMobileView = false;

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
    '/account/organization': {
      localizationKey: 'account.organization.user_management',
      permission: 'APP_B2B_MANAGE_USERS',
    },
    '/account/requisitions/buyer': {
      localizationKey: 'account.requisitions.requisitions',
      permission: 'APP_B2B_ORDER_APPROVAL',
    },
    '/account/requisitions/approver': {
      localizationKey: 'account.requisitions.approvals',
      permission: 'APP_B2B_ORDER_APPROVAL',
    },
    '/logout': { localizationKey: 'account.navigation.logout.link' },
  };

  constructor(private router: Router) {}

  ngOnInit() {
    this.isMobileView = this.deviceType === 'tablet' || this.deviceType === 'mobile';
  }

  ngOnChanges() {
    this.isMobileView = this.deviceType === 'tablet' || this.deviceType === 'mobile';
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
