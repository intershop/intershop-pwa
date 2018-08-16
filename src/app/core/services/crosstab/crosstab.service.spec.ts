import { TestBed, inject } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';

import { CrosstabService } from './crosstab.service';

describe('Crosstab Service', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({})],
      providers: [CrosstabService],
    });
  });

  it('should be created', inject([CrosstabService], (service: CrosstabService) => {
    expect(service).toBeTruthy();
  }));
});
