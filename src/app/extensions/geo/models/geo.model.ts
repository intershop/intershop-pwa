export interface FaqEntry {
  question: string;
  answer: string;
  authorName?: string;
  authorDescription?: string;
  authorOrganization?: string;
}

export interface HowToStep {
  position: number;
  name: string;
  text: string;
}

export interface HowToData {
  name?: string;
  steps: HowToStep[];
}
