import { Facet } from 'ish-core/models/facet/facet.model';

import { FilterValueMap } from './filter.interface';

export interface Filter {
  name: string;
  displayType: string;
  id: string;
  facets: Facet[];
  selectionType: string;
  filterValueMap?: FilterValueMap;
}
