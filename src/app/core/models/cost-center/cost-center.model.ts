export interface CostCenter {
  elements: CostCenterItem[];
  name: string;
  total: number;
}

export interface CostCenterItem {
  id: string;
  name: string;
  roles: string[];
  type: string;
}
