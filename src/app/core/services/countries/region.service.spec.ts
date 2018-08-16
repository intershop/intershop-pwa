import { TestBed, inject } from '@angular/core/testing';

import { RegionService } from './region.service';

describe('Region Service', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RegionService],
    });
  });

  it('should be created', inject([RegionService], (service: RegionService) => {
    expect(service).toBeTruthy();
  }));
});
