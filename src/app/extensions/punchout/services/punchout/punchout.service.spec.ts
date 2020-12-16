import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { anything, capture, instance, mock, verify, when } from 'ts-mockito';

import { Customer } from 'ish-core/models/customer/customer.model';
import { ApiService } from 'ish-core/services/api/api.service';
import { getLoggedInCustomer } from 'ish-core/store/customer/user';

import { PunchoutService } from './punchout.service';

describe('Punchout Service', () => {
  let apiServiceMock: ApiService;
  let punchoutService: PunchoutService;

  beforeEach(() => {
    apiServiceMock = mock(ApiService);
    when(apiServiceMock.get(anything())).thenReturn(of({}));
    when(apiServiceMock.resolveLinks()).thenReturn(() => of([]));

    TestBed.configureTestingModule({
      providers: [
        { provide: ApiService, useFactory: () => instance(apiServiceMock) },
        provideMockStore({
          selectors: [
            { selector: getLoggedInCustomer, value: { customerNo: '4711', isBusinessCustomer: true } as Customer },
          ],
        }),
      ],
    });
    punchoutService = TestBed.inject(PunchoutService);
  });

  it('should be created', () => {
    expect(punchoutService).toBeTruthy();
  });

  it('should call the getPunchoutOciUsers when fetching punchout users', done => {
    punchoutService.getUsers().subscribe(() => {
      verify(apiServiceMock.get(anything())).once();
      expect(capture(apiServiceMock.get).last()).toMatchInlineSnapshot(`
        Array [
          "customers/4711/punchouts/oci/users",
        ]
      `);
      done();
    });
  });
});
