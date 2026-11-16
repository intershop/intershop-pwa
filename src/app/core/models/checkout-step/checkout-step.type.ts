/**
 * available, ordered checkout steps
 */
export enum CheckoutStep {
  BeforeCheckout,
  Addresses,
  Shipping,
  Payment,
  Review,
  Receipt,
}
