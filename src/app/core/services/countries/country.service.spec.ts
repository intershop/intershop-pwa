import { TestBed, inject } from '@angular/core/testing';

import { CountryService } from './country.service';

describe('Country Service', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CountryService],
    });
  });

  it('should be created', inject([CountryService], (service: CountryService) => {
    expect(service).toBeTruthy();
  }));
});
