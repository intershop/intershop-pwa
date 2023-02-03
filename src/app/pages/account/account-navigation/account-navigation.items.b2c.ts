import { NavigationItem } from './account-navigation.component';

// not-dead-code
export const navigationItems: NavigationItem[] = [
  { id: 'my-account', localizationKey: 'account.my_account.link', routerLink: '/account' },
  {
    id: 'requisitions',
    localizationKey: 'account.requisitions.requisitions',
    routerLink: '/account/requisitions/buyer',
    serverSetting: 'services.OrderApprovalServiceDefinition.runnable',
    permission: 'APP_B2B_PURCHASE',
    notRole: ['APP_B2B_CXML_USER', 'APP_B2B_OCI_USER'],
  },
  {
    id: 'approvals',
    localizationKey: 'account.requisitions.approvals',
    routerLink: '/account/requisitions/approver',
    serverSetting: 'services.OrderApprovalServiceDefinition.runnable',
    permission: ['APP_B2B_ORDER_APPROVAL', 'APP_B2B_MANAGE_COSTCENTER'],
  },
  {
    id: 'quotes',
    localizationKey: 'account.navigation.quotes.link',
    routerLink: '/account/quotes',
    feature: 'quoting',
    notRole: ['APP_B2B_CXML_USER', 'APP_B2B_OCI_USER'],
  },
  {
    id: 'order-templates',
    localizationKey: 'account.ordertemplates.link',
    routerLink: '/account/order-templates',
    feature: 'orderTemplates',
  },
  {
    id: 'orders',
    localizationKey: 'account.order_history.link',
    routerLink: '/account/orders',
    notRole: ['APP_B2B_CXML_USER', 'APP_B2B_OCI_USER'],
  },
  {
    id: 'wishlists',
    localizationKey: 'account.wishlists.link',
    routerLink: '/account/wishlists',
    feature: 'wishlists',
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
    id: 'users',
    localizationKey: 'account.organization.user_management',
    routerLink: '/account/organization/users',
    permission: 'APP_B2B_MANAGE_USERS',
  },
  {
    id: 'cost-centers',
    localizationKey: 'account.organization.cost_center_management',
    routerLink: '/account/organization/cost-centers',
    feature: 'costCenters',
    permission: 'APP_B2B_MANAGE_COSTCENTER',
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
