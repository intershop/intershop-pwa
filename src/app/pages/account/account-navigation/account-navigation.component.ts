import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { DeviceType } from 'ish-core/models/viewtype/viewtype.types';

interface NavigationItems {
  [link: string]: {
    localizationKey: string;
    dataTestingId?: string;
    feature?: string;
    serverSetting?: string;
    permission?: string;
    notRole?: string | string[];
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
    '/account/requisitions/buyer': {
      localizationKey: 'account.requisitions.requisitions',
      serverSetting: 'services.OrderApprovalServiceDefinition.runnable',
      permission: 'APP_B2B_PURCHASE',
      notRole: ['APP_B2B_CXML_USER', 'APP_B2B_OCI_USER'],
    },
    '/account/requisitions/approver': {
      localizationKey: 'account.requisitions.approvals',
      serverSetting: 'services.OrderApprovalServiceDefinition.runnable',
      permission: 'APP_B2B_ORDER_APPROVAL',
    },
    '/account/quotes': {
      localizationKey: 'account.navigation.quotes.link',
      feature: 'quoting',
      notRole: ['APP_B2B_CXML_USER', 'APP_B2B_OCI_USER'],
    },
    '/account/order-templates': {
      localizationKey: 'account.ordertemplates.link',
      feature: 'orderTemplates',
      dataTestingId: 'order-templates-link',
    },
    '/account/orders': {
      localizationKey: 'account.order_history.link',
      notRole: ['APP_B2B_CXML_USER', 'APP_B2B_OCI_USER'],
    },
    '/account/wishlists': {
      localizationKey: 'account.wishlists.link',
      feature: 'wishlists',
      dataTestingId: 'wishlists-link',
      notRole: ['APP_B2B_CXML_USER', 'APP_B2B_OCI_USER'],
    },
    '/account/addresses': {
      localizationKey: 'account.saved_addresses.link',
      dataTestingId: 'addresses-link',
      notRole: ['APP_B2B_CXML_USER', 'APP_B2B_OCI_USER'],
    },
    '/account/payment': {
      localizationKey: 'account.payment.link',
      dataTestingId: 'payments-link',
      notRole: ['APP_B2B_CXML_USER', 'APP_B2B_OCI_USER'],
    },
    '/account/profile': { localizationKey: 'account.profile.link', notRole: ['APP_B2B_CXML_USER', 'APP_B2B_OCI_USER'] },
    '/account/organization': {
      localizationKey: 'account.organization.user_management',
      permission: 'APP_B2B_MANAGE_USERS',
    },
    '/account/punchout': {
      localizationKey: 'account.punchout.link',
      dataTestingId: 'punchout-link',
      feature: 'punchout',
      permission: 'APP_B2B_MANAGE_PUNCHOUT',
    },
    '/logout': {
      localizationKey: 'account.navigation.logout.link',
      notRole: ['APP_B2B_CXML_USER', 'APP_B2B_OCI_USER'],
    },
  };

  constructor(private router: Router) {}

  ngOnInit() {
    this.isMobileView = this.deviceType === 'tablet' || this.deviceType === 'mobile';
  }

  ngOnChanges() {
    this.isMobileView = this.deviceType === 'tablet' || this.deviceType === 'mobile';
  }

  navigateTo(target: EventTarget) {
    if (target) {
      this.router.navigateByUrl((target as HTMLDataElement).value);
    }
  }

  get unsorted() {
    return () => 0;
  }

  isSelected(itemValueLink: string): string {
    return itemValueLink === location.pathname ? 'selected' : undefined;
  }
}
