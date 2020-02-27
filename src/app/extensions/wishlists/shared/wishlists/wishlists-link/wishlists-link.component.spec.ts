import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { instance, mock } from 'ts-mockito';

import { AccountFacade } from 'ish-core/facades/account.facade';

import { WishlistsFacade } from '../../../facades/wishlists.facade';

import { WishlistsLinkComponent } from './wishlists-link.component';

describe('Wishlists Link Component', () => {
  let component: WishlistsLinkComponent;
  let fixture: ComponentFixture<WishlistsLinkComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    const wishlistFacadeMock = mock(WishlistsFacade);
    const accountFacadeMock = mock(AccountFacade);

    TestBed.configureTestingModule({
      declarations: [MockComponent(FaIconComponent), WishlistsLinkComponent],
      imports: [RouterTestingModule, TranslateModule.forRoot()],
      providers: [
        { provide: WishlistsFacade, useFactory: () => instance(wishlistFacadeMock) },
        { provide: AccountFacade, useFactory: () => instance(accountFacadeMock) },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WishlistsLinkComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
