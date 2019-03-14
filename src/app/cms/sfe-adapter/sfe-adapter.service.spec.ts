import { ApplicationRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { instance, mock } from 'ts-mockito';

import { SfeAdapterService } from './sfe-adapter.service';

describe('Sfe Adapter Service', () => {
  let routerMock: Router;
  let storeMock$: Store<{}>;
  let apprefMock: ApplicationRef;
  let sfeAdapterService: SfeAdapterService;

  beforeEach(() => {
    routerMock = mock(Router);
    storeMock$ = mock(Store);
    apprefMock = mock(ApplicationRef);

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: instance(routerMock) },
        { provide: Store, useValue: instance(storeMock$) },
        { provide: ApplicationRef, useValue: instance(apprefMock) },
      ],
    });

    sfeAdapterService = TestBed.get(SfeAdapterService);
  });

  it('should be created', () => {
    expect(sfeAdapterService).toBeTruthy();
  });
});
