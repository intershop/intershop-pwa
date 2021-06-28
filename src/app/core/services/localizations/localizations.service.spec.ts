import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { LocalizationsService } from './localizations.service';

describe('Localizations Service', () => {
  let localizationsService: LocalizationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [provideMockStore()],
    });
    localizationsService = TestBed.inject(LocalizationsService);
  });

  it('should be created', () => {
    expect(localizationsService).toBeTruthy();
  });
});
