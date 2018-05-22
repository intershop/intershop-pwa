import { Link } from '../link/link.model';

export class Facet {
  name: string;
  type: string;
  count: number;
  selected: boolean;
  link: Link;
  filterId: string;
  searchParameter: string;
}
