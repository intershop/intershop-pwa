/**
 * available, ordered checkout steps
 */
export enum CheckoutStepType {
  addresses = 1,
  shipping,
  payment,
  review,
  receipt,
}
