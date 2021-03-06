import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockDirective } from 'ng-mocks';
import { instance, mock } from 'ts-mockito';

import { ProductContextDirective } from 'ish-core/directives/product-context.directive';
import { ErrorMessageComponent } from 'ish-shared/components/common/error-message/error-message.component';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';

import { WishlistsFacade } from '../../facades/wishlists.facade';
import { WishlistPreferencesDialogComponent } from '../../shared/wishlist-preferences-dialog/wishlist-preferences-dialog.component';

import { AccountWishlistDetailLineItemComponent } from './account-wishlist-detail-line-item/account-wishlist-detail-line-item.component';
import { AccountWishlistDetailPageComponent } from './account-wishlist-detail-page.component';

describe('Account Wishlist Detail Page Component', () => {
  let component: AccountWishlistDetailPageComponent;
  let fixture: ComponentFixture<AccountWishlistDetailPageComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgbPopoverModule, TranslateModule.forRoot()],
      declarations: [
        AccountWishlistDetailPageComponent,
        MockComponent(AccountWishlistDetailLineItemComponent),
        MockComponent(ErrorMessageComponent),
        MockComponent(FaIconComponent),
        MockComponent(LoadingComponent),
        MockComponent(WishlistPreferencesDialogComponent),
        MockDirective(ProductContextDirective),
      ],
      providers: [{ provide: WishlistsFacade, useFactory: () => instance(mock(WishlistsFacade)) }],
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
