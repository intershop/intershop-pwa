import { NamedElement } from 'ish-core/models/named-element/named-element.model';
import { Region } from 'ish-core/models/region/region.model';

export interface Country extends NamedElement {
  countryCode: string;
  regions?: Region[];
}
