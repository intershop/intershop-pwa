import { AsyncPipe, NgClass } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterLink, provideRouter } from '@angular/router';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { EMPTY } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { WishlistsFacade } from '../../facades/wishlists.facade';

import { WishlistsLinkComponent } from './wishlists-link.component';

describe('Wishlists Link Component', () => {
  let component: WishlistsLinkComponent;
  let fixture: ComponentFixture<WishlistsLinkComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    const wishlistFacadeMock = mock(WishlistsFacade);
    when(wishlistFacadeMock.preferredWishlist$).thenReturn(EMPTY);

    await TestBed.configureTestingModule({
      imports: [WishlistsLinkComponent, TranslateModule.forRoot()],
      providers: [{ provide: WishlistsFacade, useFactory: () => instance(wishlistFacadeMock) }, provideRouter([])],
    })
      .overrideComponent(WishlistsLinkComponent, {
        set: {
          imports: [AsyncPipe, NgClass, TranslatePipe, RouterLink],
        },
      })
      .compileComponents();
  });

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
