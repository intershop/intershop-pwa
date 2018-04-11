import { inject, TestBed } from '@angular/core/testing';

import { CountryService } from './country.service';

describe('CountryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CountryService],
    });
  });

  it(
    'should be created',
    inject([CountryService], (service: CountryService) => {
      expect(service).toBeTruthy();
    })
  );
});
