import { Facet } from '../facet/facet.model';

export interface Filter {
  name: string;
  displayType: string;
  id: string;
  facets: Facet[];
}
