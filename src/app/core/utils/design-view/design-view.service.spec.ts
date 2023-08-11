import { TestBed } from '@angular/core/testing';

import { DesignViewService } from './design-view.service';

describe('Design View Service', () => {
  let designviewService: DesignViewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    designviewService = TestBed.inject(DesignViewService);
  });

  it('should be created', () => {
    expect(designviewService).toBeTruthy();
  });
});
