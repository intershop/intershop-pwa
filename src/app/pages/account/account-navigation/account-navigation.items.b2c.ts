import { NavigationItem } from './account-navigation.component';

// not-dead-code
export const navigationItems: NavigationItem[] = [
  { id: 'my-account', localizationKey: 'account.my_account.link', routerLink: '/account' },
  {
    id: 'orders',
    localizationKey: 'account.order_history.link',
    routerLink: '/account/orders',
    notRole: ['APP_B2B_CXML_USER', 'APP_B2B_OCI_USER'],
  },
  {
    id: 'recurring-orders',
    localizationKey: 'account.recurring_orders.navigation.link',
    routerLink: '/account/recurring-orders',
    serverSetting: 'recurringOrder.enabled',
  },
  {
    id: 'wishlists',
    localizationKey: 'account.wishlists.link',
    routerLink: '/account/wishlists',
    feature: 'wishlists',
    notRole: ['APP_B2B_CXML_USER', 'APP_B2B_OCI_USER'],
  },
  {
    id: 'notifications',
    localizationKey: 'account.notifications.link',
    routerLink: '/account/notifications',
    feature: 'productNotifications',
    notRole: ['APP_B2B_CXML_USER', 'APP_B2B_OCI_USER'],
  },
  {
    id: 'addresses',
    localizationKey: 'account.saved_addresses.link',
    routerLink: '/account/addresses',
    notRole: ['APP_B2B_CXML_USER', 'APP_B2B_OCI_USER'],
  },
  {
    id: 'payment',
    localizationKey: 'account.payment.link',
    routerLink: '/account/payment',
    notRole: ['APP_B2B_CXML_USER', 'APP_B2B_OCI_USER'],
  },
  {
    id: 'profile',
    localizationKey: 'account.profile.link',
    routerLink: '/account/profile',
    notRole: ['APP_B2B_CXML_USER', 'APP_B2B_OCI_USER'],
  },
  {
    id: 'punchout',
    localizationKey: 'account.punchout.link',
    routerLink: '/account/punchout',
    feature: 'punchout',
    permission: 'APP_B2B_MANAGE_PUNCHOUT',
  },
  {
    id: 'logout',
    localizationKey: 'account.navigation.logout.link',
    routerLink: '/logout',
    notRole: ['APP_B2B_CXML_USER', 'APP_B2B_OCI_USER'],
  },
];
