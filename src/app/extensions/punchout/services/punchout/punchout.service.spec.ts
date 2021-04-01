import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { anything, capture, instance, mock, verify, when } from 'ts-mockito';

import { Customer } from 'ish-core/models/customer/customer.model';
import { ApiService } from 'ish-core/services/api/api.service';
import { getLoggedInCustomer } from 'ish-core/store/customer/user';
import { CookiesService } from 'ish-core/utils/cookies/cookies.service';

import { PunchoutUser } from '../../models/punchout-user/punchout-user.model';

import { PunchoutService } from './punchout.service';

describe('Punchout Service', () => {
  let apiServiceMock: ApiService;
  let cookiesServiceMock: CookiesService;
  let punchoutService: PunchoutService;

  beforeEach(() => {
    apiServiceMock = mock(ApiService);
    cookiesServiceMock = mock(CookiesService);

    when(apiServiceMock.get(anything(), anything())).thenReturn(of({}));
    when(apiServiceMock.resolveLinks(anything())).thenReturn(() => of([]));
    when(apiServiceMock.post(anything(), anything(), anything())).thenReturn(of({}));
    when(apiServiceMock.resolveLink(anything())).thenReturn(() => of({}));
    when(apiServiceMock.put(anything(), anything(), anything())).thenReturn(of({}));
    when(apiServiceMock.delete(anything(), anything())).thenReturn(of({}));

    TestBed.configureTestingModule({
      providers: [
        { provide: ApiService, useFactory: () => instance(apiServiceMock) },
        { provide: CookiesService, useFactory: () => instance(cookiesServiceMock) },
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

  it('should call the getUsers when fetching punchout users', done => {
    punchoutService.getUsers().subscribe(() => {
      verify(apiServiceMock.get(anything(), anything())).once();
      expect(capture(apiServiceMock.get).last()).toMatchInlineSnapshot(`
        Array [
          "customers/4711/punchouts/oci5/users",
          Object {
            "headers": HttpHeaders {
              "lazyInit": [Function],
              "lazyUpdate": null,
              "normalizedNames": Map {},
            },
          },
        ]
      `);
      done();
    });
  });

  it('should call the addUser for creating a new punchout user', done => {
    punchoutService.createUser({ login: 'ociuser' } as PunchoutUser).subscribe(() => {
      verify(apiServiceMock.post(anything(), anything(), anything())).once();
      expect(capture(apiServiceMock.post).last()[0]).toMatchInlineSnapshot(`"customers/4711/punchouts/oci5/users"`);
      done();
    });
  });

  it('should call the updateUser for updating a punchout user', done => {
    punchoutService.updateUser({ login: 'ociuser' } as PunchoutUser).subscribe(() => {
      verify(apiServiceMock.put(anything(), anything(), anything())).once();
      expect(capture(apiServiceMock.put).last()[0]).toMatchInlineSnapshot(
        `"customers/4711/punchouts/oci5/users/ociuser"`
      );
      done();
    });
  });

  it('should call deleteUser for deleting a punchout user', done => {
    punchoutService.deleteUser('ociuser').subscribe(() => {
      verify(apiServiceMock.delete(anything(), anything())).once();
      expect(capture(apiServiceMock.delete).last()[0]).toMatchInlineSnapshot(
        `"customers/4711/punchouts/oci5/users/ociuser"`
      );
      done();
    });
  });
});
