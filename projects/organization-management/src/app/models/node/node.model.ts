export interface Node {
  id: string;
  name: string;
  description?: string;
  childNodes?: string[];
  parentNode?: string;
  organization: string;
}
