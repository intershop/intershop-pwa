import { NavigationItems } from './account-navigation.component';

export const navigationItems: NavigationItems = {
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
    permission: ['APP_B2B_ORDER_APPROVAL', 'APP_B2B_MANAGE_COSTCENTER'],
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
  '/account/organization/users': {
    localizationKey: 'account.organization.user_management',
    permission: 'APP_B2B_MANAGE_USERS',
  },
  '/account/organization/cost-centers': {
    localizationKey: 'account.organization.cost_center_management',
    feature: 'costCenters',
    dataTestingId: 'cost-centers-link',
    permission: 'APP_B2B_MANAGE_COSTCENTER',
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
