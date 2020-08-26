import { NamedElement } from 'ish-core/models/named-element/named-element.model';

export interface Region extends NamedElement {
  countryCode: string;
  regionCode: string;
  id: string;
}
