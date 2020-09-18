import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
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
      declarations: [MockComponent(FaIconComponent), WishlistsLinkComponent],
      imports: [RouterTestingModule, TranslateModule.forRoot()],
      providers: [{ provide: WishlistsFacade, useFactory: () => instance(wishlistFacadeMock) }],
    }).compileComponents();
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
