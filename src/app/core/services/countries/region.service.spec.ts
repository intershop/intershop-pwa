import { inject, TestBed } from '@angular/core/testing';

import { RegionService } from './region.service';

describe('RegionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RegionService],
    });
  });

  it(
    'should be created',
    inject([RegionService], (service: RegionService) => {
      expect(service).toBeTruthy();
    })
  );
});
