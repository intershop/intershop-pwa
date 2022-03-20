import { ComponentFixture, TestBed } from '@angular/core/testing';
import { instance, mock } from 'ts-mockito';

import { WishlistsFacade } from '../../../facades/wishlists.facade';

import { AccountWishlistDetailLineItemComponent } from './account-wishlist-detail-line-item.component';

describe('Account Wishlist Detail Line Item Component', () => {
  let component: AccountWishlistDetailLineItemComponent;
  let fixture: ComponentFixture<AccountWishlistDetailLineItemComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [{ provide: WishlistsFacade, useFactory: () => instance(mock(WishlistsFacade)) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountWishlistDetailLineItemComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
