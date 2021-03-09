import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockDirective } from 'ng-mocks';
import { of } from 'rxjs';
import { anything, capture, instance, mock, spy, verify, when } from 'ts-mockito';

import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { InputComponent } from 'ish-shared/forms/components/input/input.component';

import { WishlistsFacade } from '../../facades/wishlists.facade';

import { SelectWishlistModalComponent } from './select-wishlist-modal.component';

describe('Select Wishlist Modal Component', () => {
  let component: SelectWishlistModalComponent;
  let fixture: ComponentFixture<SelectWishlistModalComponent>;
  let element: HTMLElement;
  let wishlistFacadeMock: WishlistsFacade;
  const wishlistDetails = {
    title: 'testing wishlist',
    type: 'WishList',
    id: '.SKsEQAE4FIAAAFuNiUBWx0d',
    itemsCount: 0,
    preferred: true,
    public: false,
  };

  beforeEach(async () => {
    wishlistFacadeMock = mock(WishlistsFacade);

    await TestBed.configureTestingModule({
      declarations: [MockComponent(InputComponent), MockDirective(ServerHtmlDirective), SelectWishlistModalComponent],
      imports: [NgbModalModule, ReactiveFormsModule, TranslateModule.forRoot()],
      providers: [{ provide: WishlistsFacade, useFactory: () => instance(wishlistFacadeMock) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectWishlistModalComponent);

    component = fixture.componentInstance;
    element = fixture.nativeElement;
    when(wishlistFacadeMock.currentWishlist$).thenReturn(of(wishlistDetails));
    when(wishlistFacadeMock.preferredWishlist$).thenReturn(of());
    when(wishlistFacadeMock.wishlists$).thenReturn(of([wishlistDetails]));

    fixture.detectChanges();
    component.show();

    component.wishlistOptions = [{ value: 'wishlist', label: 'Wishlist' }];
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should emit correct object on form submit with known wishlist', () => {
    const emitter = spy(component.submitEmitter);
    component.updateWishlistForm.patchValue({ wishlist: 'wishlist' });

    component.submitForm();
    verify(emitter.emit(anything())).once();
    const [arg] = capture(emitter.emit).last();
    expect(arg).toEqual({
      id: 'wishlist',
      title: 'Wishlist',
    });
  });

  it('should emit correct object on form submit with new wishlist', () => {
    const emitter = spy(component.submitEmitter);
    component.updateWishlistForm.patchValue({ wishlist: 'newList', newWishlist: 'New Wishlist Title' });

    component.submitForm();
    verify(emitter.emit(anything())).once();
    const [arg] = capture(emitter.emit).last();
    expect(arg).toEqual({
      id: undefined,
      title: 'New Wishlist Title',
    });
  });

  it('should switch modal contents after successful submit', () => {
    component.updateWishlistForm.patchValue({ wishlist: 'wishlist' });

    component.submitForm();
    expect(element.querySelector('form')).toBeFalsy();
  });

  it('should ensure that newWishlist remove Validator after being deselected', () => {
    component.updateWishlistForm.patchValue({ wishlist: 'wishlist', newWishlist: '' });
    expect(component.updateWishlistForm.get('newWishlist').validator).toBeNull();
  });

  describe('selectedWishlistTitle', () => {
    it('should return correct title of known wishlist', () => {
      component.updateWishlistForm.patchValue({ wishlist: 'wishlist' });
      const title = component.selectedWishlistTitle;
      expect(title).toBe('Wishlist');
    });

    it('should return correct title of new wishlist', () => {
      component.updateWishlistForm.patchValue({ wishlist: 'newList', newWishlist: 'New Wishlist Title' });
      const title = component.selectedWishlistTitle;
      expect(title).toBe('New Wishlist Title');
    });
  });

  describe('selectedWishlistRoute', () => {
    it('should return correct route of known wishlist', () => {
      component.updateWishlistForm.patchValue({ wishlist: 'wishlist' });
      const route = component.selectedWishlistRoute;
      expect(route).toBe('route://account/wishlists/wishlist');
    });

    it('should return correct route of new wishlist', () => {
      component.updateWishlistForm.patchValue({ wishlist: 'newList', newWishlist: 'New Wishlist Title' });
      component.idAfterCreate = 'idAfterCreate';
      const route = component.selectedWishlistRoute;
      expect(route).toBe('route://account/wishlists/idAfterCreate');
    });
  });
});
