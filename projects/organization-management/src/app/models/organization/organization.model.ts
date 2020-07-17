export interface Organization {
  id: string;
  name?: string;
  description?: string;
  authenticationUrl?: string;
  customers?: string[];
  users?: string[];
  nodes?: string[];
}
