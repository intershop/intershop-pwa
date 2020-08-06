export interface Organization {
  id: string;
  name?: string;
  description?: string;
  customers?: string[];
  users?: string[];
  nodes?: string[];
}
