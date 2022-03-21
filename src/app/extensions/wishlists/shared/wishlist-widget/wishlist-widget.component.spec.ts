import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { EMPTY } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { WishlistsFacade } from '../../facades/wishlists.facade';

import { WishlistWidgetComponent } from './wishlist-widget.component';

describe('Wishlist Widget Component', () => {
  let component: WishlistWidgetComponent;
  let fixture: ComponentFixture<WishlistWidgetComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    const wishlistFacadeMock = mock(WishlistsFacade);
    when(wishlistFacadeMock.allWishlistsItemsSkus$).thenReturn(EMPTY);

    await TestBed.configureTestingModule({
      declarations: [WishlistWidgetComponent],
      imports: [TranslateModule.forRoot()],
      providers: [{ provide: WishlistsFacade, useFactory: () => instance(wishlistFacadeMock) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WishlistWidgetComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
