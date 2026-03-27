export interface BreadcrumbItem {
  key?: string;
  text?: string;
  link?: string | unknown[];
  linkParams?: Record<string, string>;
}
