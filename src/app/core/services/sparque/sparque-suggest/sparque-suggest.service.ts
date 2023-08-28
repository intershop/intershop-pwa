import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { SparqueItems, SparqueResponse } from 'ish-core/models/sparque/sparque.interface';
import { SuggestTerm } from 'ish-core/models/suggest-term/suggest-term.model';
import { SparqueApiService } from 'ish-core/services/sparque/sparque-api/sparque-api.service';
import { SuggestService } from 'ish-core/services/suggest/suggest.service';

@Injectable({ providedIn: 'root' })
export class SparqueSuggestService extends SuggestService {
  private sparqueApiService = inject(SparqueApiService);

  search(searchTerm: string): Observable<SuggestTerm[]> {
    return this.sparqueApiService.get<SparqueResponse>(`e/keywordsuggest/p/keyword/${searchTerm}/results`).pipe(
      map(response =>
        response?.items?.map(
          // eslint-disable-next-line ish-custom-rules/no-object-literal-type-assertion
          (item: SparqueItems) => ({ type: undefined, term: item.tuple[0] } as unknown as SuggestTerm)
        )
      )
    );
  }
}
