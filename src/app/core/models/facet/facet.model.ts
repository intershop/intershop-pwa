import { URLFormParams } from 'ish-core/utils/url-form-params';

export class Facet {
  name: string;
  count: number;
  selected: boolean;
  displayName: string;
  searchParameter: URLFormParams;
  level: number;
  mappedValue?: string;
  mappedType?: 'colorcode' | 'image' | 'text';
}
