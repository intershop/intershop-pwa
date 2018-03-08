import { FactoryHelper } from '../factory-helper';
import { SuggestTermData } from './suggest-term.interface';
import { SuggestTerm } from './suggest-term.model';

export class SuggestTermFactory {

  static fromData(data: SuggestTermData): SuggestTerm {
    const suggestTerm: SuggestTerm = new SuggestTerm();

    FactoryHelper.primitiveMapping<SuggestTermData, SuggestTerm>(data, suggestTerm);

    return suggestTerm;
  }
}
