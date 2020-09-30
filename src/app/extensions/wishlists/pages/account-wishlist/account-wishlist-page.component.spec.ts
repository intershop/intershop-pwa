import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { instance, mock } from 'ts-mockito';

import { ErrorMessageComponent } from 'ish-shared/components/common/error-message/error-message.component';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';

import { WishlistsFacade } from '../../facades/wishlists.facade';
import { WishlistPreferencesDialogComponent } from '../../shared/wishlist-preferences-dialog/wishlist-preferences-dialog.component';

import { AccountWishlistListComponent } from './account-wishlist-list/account-wishlist-list.component';
import { AccountWishlistPageComponent } from './account-wishlist-page.component';

describe('Account Wishlist Page Component', () => {
  let component: AccountWishlistPageComponent;
  let fixture: ComponentFixture<AccountWishlistPageComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    const wishlistsFacade = mock(WishlistsFacade);

    await TestBed.configureTestingModule({
      imports: [NgbPopoverModule, TranslateModule.forRoot()],
      declarations: [
        AccountWishlistPageComponent,
        MockComponent(AccountWishlistListComponent),
        MockComponent(ErrorMessageComponent),
        MockComponent(FaIconComponent),
        MockComponent(LoadingComponent),
        MockComponent(WishlistPreferencesDialogComponent),
      ],
      providers: [{ provide: WishlistsFacade, useFactory: () => instance(wishlistsFacade) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountWishlistPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
