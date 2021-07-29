export interface UserCostCenter {
  elements: UserCostCenterItem[];
  name: string;
  total: number;
}

export interface UserCostCenterItem {
  id: string;
  name: string;
  roles: string[];
  type: string;
}
