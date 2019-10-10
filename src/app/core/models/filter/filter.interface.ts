import { FacetData } from 'ish-core/models/facet/facet.interface';

export interface FilterData {
  name: string;
  type: string;
  id: string;
  filterEntries: FacetData[];
  displayType: string;
  selectionType: string;
  limitCount: number;
  minCount: number;
  scope: string;
}
