import { FacetData } from '../facet/facet.interface';

export interface FilterData {
  name: string;
  type: string;
  id: string;
  facets: FacetData[];
  displayType: string;
  selectionType: string;
  limitCount: number;
  minCount: number;
  scope: string;
}
