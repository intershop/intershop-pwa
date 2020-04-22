import { TestBed } from '@angular/core/testing';
import { instance, mock } from 'ts-mockito';

import { ApiService } from 'ish-core/services/api/api.service';

import { PersonalizationService } from './personalization.service';

describe('Personalization Service', () => {
  let apiServiceMock: ApiService;
  let personalizationService: PersonalizationService;

  beforeEach(() => {
    apiServiceMock = mock(ApiService);
    TestBed.configureTestingModule({
      providers: [{ provide: ApiService, useFactory: () => instance(apiServiceMock) }],
    });
    personalizationService = TestBed.inject(PersonalizationService);
  });

  it('should be created', () => {
    expect(personalizationService).toBeTruthy();
  });
});
