import { async, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { of } from 'rxjs/observable/of';
import { _throw } from 'rxjs/observable/throw';
import { Subject } from 'rxjs/Subject';
import { anything, instance, mock, verify, when } from 'ts-mockito/lib/ts-mockito';
import { SuggestTerm } from '../../../models/suggest-term/suggest-term.model';
import { ApiService } from '../api.service';
import { SuggestService } from './suggest.service';

xdescribe('Suggest Service', () => {
  let apiService: ApiService;
  let term$: Subject<string>;
  let searchResults: SuggestTerm[];

  beforeEach(async(() => {
    apiService = mock(ApiService);
    when(apiService.get(anything(), anything(), anything(), anything(), anything())).thenReturn(of<SuggestTerm[]>([]));
    TestBed.configureTestingModule({
      providers: [
        SuggestService,
        { provide: ApiService, useFactory: () => instance(apiService) }
      ]
    });
  }));

  beforeEach(() => {
    searchResults = undefined;
    term$ = new Subject<string>();
    TestBed.get(SuggestService).search(term$).subscribe((results) => {
      searchResults = results;
    });
  });

  it('should return a blank array when nothing is entered as search term', fakeAsync(() => {
    term$.next('');
    tick(1000);

    expect(searchResults).toEqual([]);
    verify(apiService.get(anything(), anything(), anything(), anything(), anything())).never();
  }));

  it('should return the matched terms when search term is executed', fakeAsync(() => {
    when(apiService.get(anything(), anything(), anything(), anything(), anything())).thenReturn(of<SuggestTerm[]>([{ type: undefined, term: 'Goods' }]));

    term$.next('g');
    tick(1000);

    expect(searchResults).toEqual([{ type: undefined, term: 'Goods' }]);
    verify(apiService.get(anything(), anything(), anything(), anything(), anything())).once();
  }));

  it('should debounce correctly when search term is entered stepwise', fakeAsync(() => {
    when(apiService.get(anything(), anything(), anything(), anything(), anything())).thenReturn(of<SuggestTerm[]>([{ type: undefined, term: 'Goods' }]));

    term$.next('g');
    tick(100);
    term$.next('goo');
    tick(100);
    term$.next('good');
    tick(1000);

    expect(searchResults).toEqual([{ type: undefined, term: 'Goods' }]);
    verify(apiService.get(anything(), anything(), anything(), anything(), anything())).once();
  }));

  it('should send only once if search term is entered multiple times', fakeAsync(() => {
    when(apiService.get(anything(), anything(), anything(), anything(), anything())).thenReturn(of<SuggestTerm[]>([{ type: undefined, term: 'Goods' }]));

    term$.next('good');
    tick(1000);
    term$.next('good');
    tick(1000);
    term$.next('good');
    tick(1000);

    expect(searchResults).toEqual([{ type: undefined, term: 'Goods' }]);
    verify(apiService.get(anything(), anything(), anything(), anything(), anything())).once();
  }));

  it('should return empty array when response failed', fakeAsync(() => {
    when(apiService.get(anything(), anything(), anything(), anything(), anything())).thenReturn(_throw('err'));

    term$.next('g');
    tick(1000);

    expect(searchResults).toEqual([]);
    verify(apiService.get(anything(), anything(), anything(), anything(), anything())).once();
  }));
});
