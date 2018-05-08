import { Facet } from '../facet/facet.model';

export interface Filter {
  name: string;
  type: string;
  id: string;
  facets: Facet[];
}
