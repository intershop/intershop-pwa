export interface Attribute<T = unknown> {
  name: string;
  type?: string;
  value: T;
}
