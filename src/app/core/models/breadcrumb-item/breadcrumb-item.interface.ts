export interface BreadcrumbItem {
  key?: string;
  text?: string;
  link?: string | unknown[];
  linkParams?: { [key: string]: string };
}
