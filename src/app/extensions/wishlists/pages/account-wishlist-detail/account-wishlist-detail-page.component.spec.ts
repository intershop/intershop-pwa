import { AsyncPipe } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterLink } from '@angular/router';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { TranslatePipe, provideTranslateService } from '@ngx-translate/core';
import { MockComponent, MockDirective } from 'ng-mocks';
import { instance, mock } from 'ts-mockito';

import { ProductContextDirective } from 'ish-core/directives/product-context.directive';
import { ErrorMessageComponent } from 'ish-shared/components/common/error-message/error-message.component';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';

import { WishlistsFacade } from '../../facades/wishlists.facade';
import { WishlistLineItemComponent } from '../../shared/wishlist-line-item/wishlist-line-item.component';
import { WishlistPreferencesDialogComponent } from '../../shared/wishlist-preferences-dialog/wishlist-preferences-dialog.component';
import { WishlistSharingDialogComponent } from '../../shared/wishlist-sharing-dialog/wishlist-sharing-dialog.component';

import { AccountWishlistDetailPageComponent } from './account-wishlist-detail-page.component';

describe('Account Wishlist Detail Page Component', () => {
  let component: AccountWishlistDetailPageComponent;
  let fixture: ComponentFixture<AccountWishlistDetailPageComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountWishlistDetailPageComponent],
      providers: [
        { provide: WishlistsFacade, useFactory: () => instance(mock(WishlistsFacade)) },
        provideTranslateService(),
      ],
    })
      .overrideComponent(AccountWishlistDetailPageComponent, {
        set: {
          imports: [
            AsyncPipe,
            NgbPopover,
            MockDirective(ProductContextDirective),
            TranslatePipe,
            MockComponent(LoadingComponent),
            MockComponent(ErrorMessageComponent),
            MockComponent(WishlistLineItemComponent),
            MockComponent(WishlistPreferencesDialogComponent),
            MockComponent(WishlistSharingDialogComponent),
            MockDirective(RouterLink),
          ],
        },
      })
      .compileComponents();
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
