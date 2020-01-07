import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { AccountFacade } from 'ish-core/facades/account.facade';

import { WishlistsFacade } from '../../../facades/wishlists.facade';

import { WishlistsLinkComponent } from './wishlists-link.component';

describe('Wishlists Link Component', () => {
  let component: WishlistsLinkComponent;
  let fixture: ComponentFixture<WishlistsLinkComponent>;
  let wishlistFacadeMock: WishlistsFacade;
  let accountFacadeMock: AccountFacade;
  let element: HTMLElement;

  const wishlistDetails = [
    {
      title: 'testing wishlist',
      type: 'WishList',
      id: '.SKsEQAE4FIAAAFuNiUBWx0d',
      itemsCount: 0,
      preferred: true,
      public: false,
    },
  ];

  beforeEach(async(() => {
    wishlistFacadeMock = mock(WishlistsFacade);
    accountFacadeMock = mock(AccountFacade);

    TestBed.configureTestingModule({
      declarations: [MockComponent(FaIconComponent), WishlistsLinkComponent],
      imports: [RouterTestingModule, TranslateModule.forRoot()],
      providers: [
        { provide: WishlistsFacade, useFactory: () => instance(wishlistFacadeMock) },
        { provide: AccountFacade, useFactory: () => instance(accountFacadeMock) },
      ],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(WishlistsLinkComponent);
        component = fixture.componentInstance;
        element = fixture.nativeElement;
        when(wishlistFacadeMock.wishlists$).thenReturn(of(wishlistDetails));
        when(accountFacadeMock.isLoggedIn$).thenReturn(of(true));
      });
  }));

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
