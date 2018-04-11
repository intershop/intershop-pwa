import { async, TestBed } from '@angular/core/testing';
import { of } from 'rxjs/observable/of';
import { anything, instance, mock, verify, when } from 'ts-mockito/lib/ts-mockito';
import { SuggestTerm } from '../../../models/suggest-term/suggest-term.model';
import { ApiService } from '../api.service';
import { SuggestService } from './suggest.service';

describe('Suggest Service', () => {
  let apiService: ApiService;
  let suggestService: SuggestService;

  beforeEach(
    async(() => {
      apiService = mock(ApiService);
      when(apiService.get(anything(), anything(), anything(), anything(), anything())).thenReturn(
        of<SuggestTerm[]>([])
      );
      TestBed.configureTestingModule({
        providers: [SuggestService, { provide: ApiService, useFactory: () => instance(apiService) }],
      });
      suggestService = TestBed.get(SuggestService);
    })
  );

  it('should always delegate to api service when called', () => {
    verify(apiService.get(anything(), anything(), anything(), anything(), anything())).never();

    suggestService.search('some');
    verify(apiService.get(anything(), anything(), anything(), anything(), anything())).once();
  });

  it('should return the matched terms when search term is executed', () => {
    const result = [{ type: undefined, term: 'Goods' }];
    when(apiService.get(anything(), anything(), anything(), anything(), anything())).thenReturn(
      of<SuggestTerm[]>(result)
    );

    suggestService.search('g').subscribe(res => {
      expect(res).toEqual(result);
    });

    verify(apiService.get(anything(), anything(), anything(), anything(), anything())).once();
  });
});
