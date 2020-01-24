import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { DeviceType } from 'ish-core/models/viewtype/viewtype.types';

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
  navigationItems: { link: string; localizationKey: string; dataTestingId?: string; feature?: string }[] = [
    { link: '/account', localizationKey: 'account.my_account.link' },
    { link: '/account/orders', localizationKey: 'account.order_history.link' },
    { link: '/account/payment', localizationKey: 'account.payment.link' },
    { link: '/account/addresses', localizationKey: 'account.saved_addresses.link', dataTestingId: 'addresses-link' },
    { link: '/account/profile', localizationKey: 'account.profile.link' },
    { link: '/account/quote-list', localizationKey: 'account.navigation.quotes.link', feature: 'quoting' },
    { link: '/logout', localizationKey: 'account.navigation.logout.link' },
  ];

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
}
