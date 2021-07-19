import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockDirective } from 'ng-mocks';
import { of } from 'rxjs';
import { anything, capture, instance, mock, spy, verify, when } from 'ts-mockito';

import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { FormlyTestingModule } from 'ish-shared/formly/dev/testing/formly-testing.module';
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
      imports: [FormlyTestingModule, NgbModalModule, ReactiveFormsModule, TranslateModule.forRoot()],
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
  });

  beforeEach(() => {
    fixture.detectChanges();
    component.show();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should emit correct object on form submit with known wishlist', fakeAsync(() => {
    fixture.detectChanges();

    const emitter = spy(component.submitEmitter);
    component.radioButtonsFormGroup.patchValue({ wishlist: '.SKsEQAE4FIAAAFuNiUBWx0d' });

    component.submitForm();
    tick(1000);
    verify(emitter.emit(anything())).once();
    const [arg] = capture(emitter.emit).last();
    expect(arg).toEqual({
      id: '.SKsEQAE4FIAAAFuNiUBWx0d',
      title: 'testing wishlist',
    });
  }));

  it('should emit correct object on radio button form submit with new wishlist', fakeAsync(() => {
    fixture.detectChanges();

    const emitter = spy(component.submitEmitter);
    component.radioButtonsFormGroup.patchValue({ wishlist: 'new' });
    component.newListFormControl.patchValue('New Wishlist Title');

    component.submitForm();
    tick(100);
    verify(emitter.emit(anything())).once();
    const [arg] = capture(emitter.emit).last();
    expect(arg).toEqual({
      id: undefined,
      title: 'New Wishlist Title',
    });
  }));
  it('should emit correct object on single field form submit with new wishlist', fakeAsync(() => {
    fixture.detectChanges();

    const emitter = spy(component.submitEmitter);
    component.newListFormControl.patchValue('New Wishlist Title');

    component.submitForm();
    tick(1000);
    verify(emitter.emit(anything())).once();
    const [arg] = capture(emitter.emit).last();
    expect(arg).toEqual({
      id: undefined,
      title: 'New Wishlist Title',
    });
  }));

  it('should not emit on radio button form submit with no new wishlist name', () => {
    fixture.detectChanges();

    const emitter = spy(component.submitEmitter);
    component.radioButtonsFormGroup.patchValue({ wishlist: 'new' });
    component.newListFormControl.patchValue('');

    component.submitForm();
    verify(emitter.emit(anything())).never();
  });

  fit('should not emit on single field form submit with no wishlist name', fakeAsync(() => {
    fixture.detectChanges();

    const emitter = spy(component.submitEmitter);
    component.newListFormControl.patchValue('');

    component.submitForm();
    tick(100);
    verify(emitter.emit(anything())).never();
  }));

  it('should switch modal contents after successful submit', fakeAsync(() => {
    fixture.detectChanges();

    component.radioButtonsFormGroup.patchValue({ wishlist: '.SKsEQAE4FIAAAFuNiUBWx0d' });

    component.submitForm();
    tick(100);
    expect(element.querySelector('form')).toBeFalsy();
  }));

  describe('selectedWishlistTitle', () => {
    it('should return correct title of known wishlist', done => {
      fixture.detectChanges();

      component.radioButtonsFormGroup.patchValue({ wishlist: '.SKsEQAE4FIAAAFuNiUBWx0d' });
      component.selectedWishlistTitle$.subscribe(t => {
        expect(t).toBe('testing wishlist');
        done();
      });
    });

    it('should return correct title of new wishlist', done => {
      fixture.detectChanges();

      component.newListFormControl.patchValue('New Wishlist Title');
      component.selectedWishlistTitle$.subscribe(t => {
        expect(t).toBe('New Wishlist Title');
        done();
      });
    });
  });

  describe('selectedWishlistRoute', () => {
    it('should return correct route of known wishlist', done => {
      fixture.detectChanges();

      component.radioButtonsFormGroup.patchValue({ wishlist: '.SKsEQAE4FIAAAFuNiUBWx0d' });
      component.selectedWishlistRoute$.subscribe(r => {
        expect(r).toBe('route://account/wishlists/.SKsEQAE4FIAAAFuNiUBWx0d');
        done();
      });
    });

    it('should return correct route of new wishlist', done => {
      fixture.detectChanges();

      component.newListFormControl.patchValue('New Wishlist Title');
      component.selectedWishlistRoute$.subscribe(r => {
        expect(r).toBe('route://account/wishlists/.SKsEQAE4FIAAAFuNiUBWx0d');
        done();
      });
    });
  });
});
