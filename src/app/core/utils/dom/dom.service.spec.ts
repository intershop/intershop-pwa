import { TestBed } from '@angular/core/testing';

import { DomService } from './dom.service';

describe('Dom Service', () => {
  let domService: DomService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    domService = TestBed.inject(DomService);
  });

  it('should be created', () => {
    expect(domService).toBeTruthy();
  });
});
