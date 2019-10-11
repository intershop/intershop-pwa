import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';

import { SfeAdapterService } from './sfe-adapter.service';

describe('Sfe Adapter Service', () => {
  let sfeAdapterService: SfeAdapterService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, ngrxTesting()],
    });

    sfeAdapterService = TestBed.get(SfeAdapterService);
  });

  it('should be created', () => {
    expect(sfeAdapterService).toBeTruthy();
  });
});
