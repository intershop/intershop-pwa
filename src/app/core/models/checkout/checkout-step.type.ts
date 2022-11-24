/**
 * available, ordered checkout steps
 */
export enum CheckoutStepType {
  Checkout,
  Addresses = 1,
  Shipping,
  Payment,
  Review,
  Receipt,
}
