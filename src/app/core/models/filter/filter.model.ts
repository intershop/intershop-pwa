import { Facet } from 'ish-core/models/facet/facet.model';

export interface Filter {
  name: string;
  displayType: string;
  id: string;
  facets: Facet[];
  selectionType: string;
  limitCount?: number;
}
