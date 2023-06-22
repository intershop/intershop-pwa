/**
 * generic type to extract return type from a property K out of T
 */
export type ReturnTypeFromKey<T, K extends keyof T> = T[K];
