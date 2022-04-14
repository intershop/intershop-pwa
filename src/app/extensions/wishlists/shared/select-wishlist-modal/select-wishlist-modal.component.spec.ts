import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { anything, capture, instance, mock, spy, verify, when } from 'ts-mockito';

import { FormlyTestingModule } from 'ish-shared/formly/dev/testing/formly-testing.module';

import { WishlistsFacade } from '../../facades/wishlists.facade';
import { Wishlist } from '../../models/wishlist/wishlist.model';
import { SelectWishlistFormComponent } from '../select-wishlist-form/select-wishlist-form.component';

import { SelectWishlistModalComponent } from './select-wishlist-modal.component';

describe('Select Wishlist Modal Component', () => {
  let component: SelectWishlistModalComponent;
  let fixture: ComponentFixture<SelectWishlistModalComponent>;
  let element: HTMLElement;
  let wishlistFacadeMock: WishlistsFacade;

  /**
   * A fixture.detectChanges() is necessary to make sure the newList
   * formControl is not disabled from its expressionProperty
   */
  function updateWishlistAndNewList(newList: string = 'New Wishlist Title') {
    component.formGroup.patchValue({ wishlist: 'new' });
    fixture.detectChanges();
    component.formGroup.patchValue({ newList });
  }

  /**
   * emulates a realistic startup scenario:
   * the component is initialized before the show() function is called and
   * real functionality begins
   */
  function startup() {
    fixture.detectChanges();
    component.show();
    fixture.detectChanges();
  }

  const wishlistDetails = {
    title: 'testing wishlist',
    type: 'WishList',
    id: '.SKsEQAE4FIAAAFuNiUBWx0d',
    itemsCount: 0,
    preferred: false,
    public: false,
  };

  beforeEach(async () => {
    wishlistFacadeMock = mock(WishlistsFacade);

    await TestBed.configureTestingModule({
      declarations: [SelectWishlistFormComponent, SelectWishlistModalComponent],
      imports: [FormlyTestingModule, TranslateModule.forRoot()],
      providers: [{ provide: WishlistsFacade, useFactory: () => instance(wishlistFacadeMock) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectWishlistModalComponent);

    component = fixture.componentInstance;
    element = fixture.nativeElement;
    when(wishlistFacadeMock.currentWishlist$).thenReturn(of(wishlistDetails));
    when(wishlistFacadeMock.preferredWishlist$).thenReturn(of());
    when(wishlistFacadeMock.wishlistSelectOptions$(anything())).thenReturn(
      of([{ value: wishlistDetails.id, label: wishlistDetails.title }])
    );
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should emit correct object on form submit with known wishlist', fakeAsync(() => {
    startup();
    const emitter = spy(component.submitEmitter);
    component.formGroup.patchValue({ wishlist: wishlistDetails.id });

    component.submitForm();
    tick(1000);
    verify(emitter.emit(anything())).once();
    const [arg] = capture(emitter.emit).last();
    expect(arg).toMatchInlineSnapshot(`
Object {
  "id": ".SKsEQAE4FIAAAFuNiUBWx0d",
  "title": "testing wishlist",
}
`);
  }));

  it('should emit correct object on radio button form submit with new wishlist', fakeAsync(() => {
    startup();

    const emitter = spy(component.submitEmitter);
    updateWishlistAndNewList();

    component.submitForm();
    tick(1000);
    verify(emitter.emit(anything())).once();
    const [arg] = capture(emitter.emit).last();
    expect(arg).toMatchInlineSnapshot(`
Object {
  "id": undefined,
  "title": "New Wishlist Title",
}
`);
  }));

  it('should emit correct object on single field form submit with new wishlist', fakeAsync(() => {
    when(wishlistFacadeMock.wishlistSelectOptions$(anything())).thenReturn(of([]));
    startup();

    const emitter = spy(component.submitEmitter);
    component.formGroup.patchValue({ newList: 'New Wishlist Title' });

    component.submitForm();
    tick(1000);
    verify(emitter.emit(anything())).once();
    const [arg] = capture(emitter.emit).last();
    expect(arg).toMatchInlineSnapshot(`
Object {
  "id": undefined,
  "title": "New Wishlist Title",
}
`);
  }));

  it('should not emit on radio button form submit with no new wishlist name', () => {
    startup();

    const emitter = spy(component.submitEmitter);
    updateWishlistAndNewList('');

    component.submitForm();
    verify(emitter.emit(anything())).never();
  });

  it('should not emit on single field form submit with no wishlist name', fakeAsync(() => {
    when(wishlistFacadeMock.wishlistSelectOptions$(anything())).thenReturn(of([]));
    startup();

    const emitter = spy(component.submitEmitter);
    component.formGroup.patchValue({ newList: '' });

    component.submitForm();
    tick(100);
    verify(emitter.emit(anything())).never();
  }));

  it('should switch modal contents after successful submit', fakeAsync(() => {
    startup();

    component.formGroup.patchValue({ wishlist: wishlistDetails.id });

    component.submitForm();
    tick(100);
    expect(element.querySelector('form')).toBeFalsy();
  }));

  describe('selectedWishlistTitle', () => {
    it('should return correct title of known wishlist', done => {
      startup();

      component.formGroup.patchValue({ wishlist: wishlistDetails.id });
      component.selectedWishlistTitle$.subscribe(t => {
        expect(t).toBe('testing wishlist');
        done();
      });
    });

    it('should return correct title of new wishlist', done => {
      startup();
      updateWishlistAndNewList();

      component.selectedWishlistTitle$.subscribe(t => {
        expect(t).toBe('New Wishlist Title');
        done();
      });
    });
    it('should return correct title of new wishlist at single field form', done => {
      when(wishlistFacadeMock.wishlistSelectOptions$(anything())).thenReturn(of([]));
      startup();

      component.formGroup.patchValue({ newList: 'New Wishlist Title' });
      component.selectedWishlistTitle$.subscribe(t => {
        expect(t).toBe('New Wishlist Title');
        done();
      });
    });
  });

  describe('selectedWishlistRoute', () => {
    it('should return correct route of known wishlist', done => {
      startup();

      component.formGroup.patchValue({ wishlist: wishlistDetails.id });
      component.selectedWishlistRoute$.subscribe(r => {
        expect(r).toBe(`route://account/wishlists/${wishlistDetails.id}`);
        done();
      });
    });

    it('should return correct route of new wishlist', done => {
      startup();

      updateWishlistAndNewList();

      when(wishlistFacadeMock.currentWishlist$).thenReturn(
        of({
          id: 'newList',
        } as Wishlist)
      );
      component.selectedWishlistRoute$.subscribe(r => {
        expect(r).toBe('route://account/wishlists/newList');
        done();
      });
    });
    it('should return correct route of new wishlist at single field form', done => {
      when(wishlistFacadeMock.wishlistSelectOptions$(anything())).thenReturn(of([]));
      startup();

      updateWishlistAndNewList();
      when(wishlistFacadeMock.currentWishlist$).thenReturn(
        of({
          id: 'newList',
        } as Wishlist)
      );

      component.selectedWishlistRoute$.subscribe(r => {
        expect(r).toBe('route://account/wishlists/newList');
        done();
      });
    });
  });
});
