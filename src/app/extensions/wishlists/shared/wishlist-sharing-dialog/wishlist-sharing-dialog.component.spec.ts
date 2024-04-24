import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, Validators } from '@angular/forms';
import { anything, capture, spy, verify } from 'ts-mockito';

import { WishlistSharingDialogComponent } from './wishlist-sharing-dialog.component';

describe('Wishlist Sharing Dialog Component', () => {
  let component: WishlistSharingDialogComponent;
  let fixture: ComponentFixture<WishlistSharingDialogComponent>;
  let element: HTMLElement;

  beforeEach(() => {
    fixture = TestBed.createComponent(WishlistSharingDialogComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should emit wishlist sharing data when form is submitted and valid', () => {
    const recipientEmails = 'test@example.com';
    const personalMessage = 'Test message';

    component.wishListForm.setControl('friendEmails', new FormControl(recipientEmails));
    component.wishListForm.setControl('personalMessage', new FormControl(personalMessage));

    const emitter = spy(component.submitWishlistSharing);

    component.submitWishlistForm();

    verify(emitter.emit(anything())).once();
    const [arg] = capture(emitter.emit).last();
    expect(arg).toEqual({ recipients: recipientEmails, message: personalMessage });
    expect(component.wishListForm.valid).toBeTrue();
    expect(component.submitted).toBeFalse();
  });

  it('should not emit wishlist sharing data when form is submitted and invalid', () => {
    component.wishListForm.setControl('friendEmails', new FormControl('', [Validators.required]));
    component.wishListForm.setControl('personalMessage', new FormControl(''));

    const emitter = spy(component.submitWishlistSharing);

    component.submitWishlistForm();

    verify(emitter.emit(anything())).never();
    expect(component.wishListForm.invalid).toBeTrue();
    expect(component.submitted).toBeTrue();
  });
});
