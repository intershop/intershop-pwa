import { Link } from 'ish-core/models/link/link.model';

export class FacetData {
  name: string;
  type: string;
  count: number;
  selected: boolean;
  link: Link;
  level: number;
  mappedValue?: string;
  mappedType?: 'colorcode' | 'image' | 'text';
  displayValue: string;
}
