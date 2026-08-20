export interface FaqEntry {
  question: string;
  answer: string;
  authorName?: string;
  authorDescription?: string;
  authorOrganization?: string;
}

export interface SchemaFAQPage {
  '@context': 'https://schema.org';
  '@type': 'FAQPage';
  mainEntity: {
    '@type': 'Question';
    name: string;
    acceptedAnswer: {
      '@type': 'Answer';
      text: string;
      dateModified?: string;
      author?: {
        '@type': 'Person';
        name: string;
        description?: string;
        affiliation?: {
          '@type': 'Organization';
          name: string;
        };
      };
    };
  }[];
}

export interface SchemaHowTo {
  '@context': 'https://schema.org';
  '@type': 'HowTo';
  name: string;
  step: {
    '@type': 'HowToStep';
    position: number;
    name: string;
    text: string;
  }[];
  tool?: {
    '@type': 'HowToTool';
    name: string;
  }[];
  supply?: {
    '@type': 'HowToSupply';
    name: string;
  }[];
}
