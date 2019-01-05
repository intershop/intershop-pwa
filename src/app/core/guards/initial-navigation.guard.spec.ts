import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule } from '@ngrx/store';

import { InitialNavigationGuard } from './initial-navigation.guard';

describe('Initial Navigation Guard', () => {
  let guard: InitialNavigationGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, StoreModule.forRoot({})],
      providers: [InitialNavigationGuard],
    });

    guard = TestBed.get(InitialNavigationGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
