import { FaqEntry, FaqRaw, HowToData, HowToStep } from './geo.model';

export class GeoHelper {
  static parseFaq(attributeData: string): FaqEntry[] {
    const parsed = GeoHelper.parseGeoAttribute<{ mainEntity?: FaqRaw[] }>(attributeData);
    console.log('PARSED FAQ', parsed);
    const entities = parsed?.mainEntity;
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

  static parseHowTo(attributeData: string): HowToData {
    const parsed = GeoHelper.parseGeoAttribute<{ name?: string; step?: HowToStep[] }>(attributeData);
    console.log('PARSED HOWTO', parsed);
    const steps = parsed?.step;
    if (!Array.isArray(steps)) {
      return { steps: [] };
    }
    return {
      name: parsed.name,
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

  private static parseGeoAttribute<T>(attributeData: string): T | undefined {
    if (!attributeData) {
      return;
    }
    try {
      return JSON.parse(attributeData) as T;
    } catch {
      return;
    }
  }
}
