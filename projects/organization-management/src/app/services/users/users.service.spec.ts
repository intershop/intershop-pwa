import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { anything, capture, instance, mock, verify, when } from 'ts-mockito';

import { ApiService } from 'ish-core/services/api/api.service';

import { UsersService } from './users.service';

describe('Users Service', () => {
  let apiService: ApiService;
  let usersService: UsersService;

  beforeEach(() => {
    apiService = mock(ApiService);
    when(apiService.get(anything())).thenReturn(of(true));
    when(apiService.resolveLinks()).thenReturn(() => of([]));

    TestBed.configureTestingModule({
      providers: [{ provide: ApiService, useFactory: () => instance(apiService) }],
    });
    usersService = TestBed.inject(UsersService);
  });

  it('should be created', () => {
    expect(usersService).toBeTruthy();
  });

  it('should call the users of customer API when fetching users', done => {
    usersService.getUsers().subscribe(() => {
      verify(apiService.get(anything())).once();
      expect(capture(apiService.get).last()).toMatchInlineSnapshot(`
        Array [
          "customers/-/users",
        ]
      `);
      done();
    });
  });

  it('should call the user of customer API when fetching user', done => {
    usersService.getUser('pmiller@test.intershop.de').subscribe(() => {
      verify(apiService.get(anything())).once();
      expect(capture(apiService.get).last()).toMatchInlineSnapshot(`
        Array [
          "customers/-/users/pmiller@test.intershop.de",
        ]
      `);
      done();
    });
  });
});
