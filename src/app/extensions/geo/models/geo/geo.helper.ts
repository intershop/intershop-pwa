import { ProductData } from 'ish-core/models/product/product.interface';

import { FaqEntry, HowToData, HowToStep } from './geo.model';

interface FaqRaw {
  name: string;
  acceptedAnswer: {
    text: string;
    author?: { name?: string; description?: string; affiliation?: { name?: string } };
  };
}

export class GeoHelper {
  static parseFaqs(attributeGroups: ProductData['attributeGroups']): FaqEntry[] {
    const parsed = GeoHelper.parseGeoAttribute<{ mainEntity?: FaqRaw[] } | FaqRaw[]>(attributeGroups, 'GEO_FAQ');
    const entities = Array.isArray(parsed) ? parsed : parsed?.mainEntity;
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

  static parseHowTo(attributeGroups: ProductData['attributeGroups']): HowToData {
    const parsed = GeoHelper.parseGeoAttribute<{ name?: string; step?: HowToStep[] } | HowToStep[]>(
      attributeGroups,
      'GEO_HOW_TO'
    );
    const steps = Array.isArray(parsed) ? parsed : parsed?.step;
    if (!Array.isArray(steps)) {
      return { steps: [] };
    }
    return {
      name: !Array.isArray(parsed) && typeof parsed?.name === 'string' ? parsed.name : undefined,
      steps: steps.map(s => ({ position: s.position, name: s.name, text: s.text })),
    };
  }

  static buildFaqJsonLd(faqs: FaqEntry[]): object {
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
          ...(faq.authorName
            ? {
                author: {
                  '@type': 'Person',
                  name: faq.authorName,
                  ...(faq.authorDescription ? { description: faq.authorDescription } : {}),
                  ...(faq.authorOrganization
                    ? { affiliation: { '@type': 'Organization', name: faq.authorOrganization } }
                    : {}),
                },
              }
            : {}),
        },
      })),
    };
  }

  static buildHowToJsonLd(howTo: HowToData): object {
    return {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      ...(howTo.name ? { name: howTo.name } : {}),
      step: howTo.steps.map(s => ({
        '@type': 'HowToStep',
        position: s.position,
        name: s.name,
        text: s.text,
      })),
    };
  }

  private static getGeoAttributeValue(
    attributeGroups: ProductData['attributeGroups'],
    name: 'GEO_FAQ' | 'GEO_HOW_TO'
  ): object | string | undefined {
    return attributeGroups?.GEO?.attributes?.find(a => a.name === name)?.value as object | string | undefined;
  }

  private static parseGeoAttribute<T>(
    attributeGroups: ProductData['attributeGroups'],
    name: 'GEO_FAQ' | 'GEO_HOW_TO'
  ): T | undefined {
    const value = GeoHelper.getGeoAttributeValue(attributeGroups, name);
    if (!value) {
      return;
    }
    try {
      return typeof value === 'string' ? (JSON.parse(value) as T) : (value as T);
    } catch {
      return;
    }
  }
}
