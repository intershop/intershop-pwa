import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { SfeAdapterService } from './sfe-adapter.service';

describe('Sfe Adapter Service', () => {
  let sfeAdapterService: SfeAdapterService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [provideMockStore()],
    });

    sfeAdapterService = TestBed.inject(SfeAdapterService);
  });

  it('should be created', () => {
    expect(sfeAdapterService).toBeTruthy();
  });
});
