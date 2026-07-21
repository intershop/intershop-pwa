import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslatePipe, provideTranslateService } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { ErrorMessageComponent } from 'ish-shared/components/common/error-message/error-message.component';

import { WishlistsFacade } from '../../facades/wishlists.facade';

import { AccountWishlistDetailPageComponent } from './account-wishlist-detail-page.component';

describe('Account Wishlist Detail Page Component', () => {
  let component: AccountWishlistDetailPageComponent;
  let fixture: ComponentFixture<AccountWishlistDetailPageComponent>;
  let element: HTMLElement;
  let wishlistsFacade: WishlistsFacade;

  beforeEach(async () => {
    wishlistsFacade = mock(WishlistsFacade);
    when(wishlistsFacade.currentWishlist$).thenReturn(of(undefined));

    await TestBed.configureTestingModule({
      imports: [TranslatePipe],
      declarations: [AccountWishlistDetailPageComponent, MockComponent(ErrorMessageComponent)],
      providers: [{ provide: WishlistsFacade, useFactory: () => instance(wishlistsFacade) }, provideTranslateService()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountWishlistDetailPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
