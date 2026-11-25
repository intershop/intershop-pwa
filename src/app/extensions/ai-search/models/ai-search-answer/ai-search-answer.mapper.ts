import { AiSearchAnswerData } from './ai-search-answer.interface';
import { AiSearchAnswer } from './ai-search-answer.model';

export class AiSearchAnswerMapper {
  // UC-001 BR-009: The AI answer is taken as is, not reconciled with the product list.
  static fromData(data: AiSearchAnswerData, searchQuery: string): AiSearchAnswer {
    return {
      searchQuery,
      text: typeof data?.text === 'string' ? data.text.trim() : '',
    };
  }
}
