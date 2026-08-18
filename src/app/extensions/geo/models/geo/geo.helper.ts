import { FaqEntry, SchemaFAQPage } from './geo.model';

export class GeoHelper {
  static parseGeoAttribute<T>(attributeData: string): T | undefined {
    if (!attributeData) {
      return;
    }
    try {
      return JSON.parse(attributeData) as T;
    } catch {
      return;
    }
  }

  static parseFaq(attributeData: string): FaqEntry[] {
    const entities = GeoHelper.parseGeoAttribute<SchemaFAQPage>(attributeData)?.mainEntity;
    if (!Array.isArray(entities)) {
      return [];
    }
    return entities.map(e => ({
      question: e.name,
      answer: e.acceptedAnswer?.text,
      authorName: e.acceptedAnswer?.author?.name,
      authorDescription: e.acceptedAnswer?.author?.description,
      authorOrganization: e.acceptedAnswer?.author?.affiliation?.name,
    }));
  }
}
