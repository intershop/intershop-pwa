export interface CostCenterQuery {
  limit: number;
  offset?: number;
  centerId?: string[];
  manager?: string;
  status?: string;
}
