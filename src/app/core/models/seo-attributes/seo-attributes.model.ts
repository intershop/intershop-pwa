export interface SeoAttributes {
  title: string;
  description: string;
  robots: string;
  canonical?: string;
  [key: string]: string;
}
