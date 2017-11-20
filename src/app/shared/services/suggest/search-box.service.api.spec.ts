import { inject, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { anything, instance, mock, verify } from 'ts-mockito/lib/ts-mockito';
import { ApiService } from '../../services/api.service';
import { SearchBoxApiService } from './search-box.service.api';

describe('Search Box Api Service', () => {
  const apiServiceMock: ApiService = mock(ApiService);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SearchBoxApiService,
        { provide: ApiService, useFactory: () => instance(apiServiceMock) },
      ],
    });
  });

  it('should search when search term is passed', inject([SearchBoxApiService], (searchBoxApiService: SearchBoxApiService) => {
    const searchTerm = searchBoxApiService.search(Observable.of('g'));
    expect(searchTerm).toBeTruthy();
  }));

  it('should call api service on receiving search term', inject([SearchBoxApiService], (searchBoxApiService: SearchBoxApiService) => {
    searchBoxApiService.searchEntries('url');
    verify(apiServiceMock.get(anything())).once();
  }));
});
