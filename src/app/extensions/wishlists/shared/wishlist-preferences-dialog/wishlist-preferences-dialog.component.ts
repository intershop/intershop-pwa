import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { markAsDirtyRecursive } from 'ish-shared/forms/utils/form-utils';

import { Wishlist } from '../../models/wishlist/wishlist.model';

/**
 * The Wishlist Preferences Dialog shows the modal to create/edit a wishlist.
 *
 * @example
 * <ish-account-wishlist-preferences-dialog
    [wishlist]="wishlist"
    (submit)="createWishlist($event)">
   </ish-account-wishlist-preferences-dialog>
 */
@Component({
  selector: 'ish-wishlist-preferences-dialog',
  templateUrl: './wishlist-preferences-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WishlistPreferencesDialogComponent implements OnChanges {
  /**
   * Predefined wishlist to fill the form with, if there is no wishlist a new wishlist will be created
   */
  @Input() wishlist: Wishlist;

  /**
   * Emits the data of the new wishlist to create.
   */
  @Output() submit = new EventEmitter<Wishlist>();

  wishListForm: FormGroup;
  submitted = false;

  /**
   *  A reference to the current modal.
   */
  modal: NgbModalRef;

  // localization keys, default = for new

  primaryButton = 'account.wishlists.new_wishlist_form.create_button.text';
  wishlistTitle = 'account.wishlists.choose_wishlist.new_wishlist_name.initial_value';
  modalHeader = 'account.wishlists.new_wishlist_dialog.header';

  @ViewChild('modal') modalTemplate: TemplateRef<unknown>;

  constructor(private fb: FormBuilder, private ngbModal: NgbModal) {
    this.initForm();
  }

  ngOnChanges() {
    this.patchForm();
    if (this.wishlist) {
      this.primaryButton = 'account.wishlists.edit_wishlist_form.save_button.text';
      this.wishlistTitle = this.wishlist.title;
      this.modalHeader = 'account.wishlist.list.edit';
    }
  }

  initForm() {
    this.wishListForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(35)]],
      preferred: false,
    });
  }

  patchForm() {
    if (this.wishlist) {
      this.wishListForm.setValue({
        title: this.wishlist.title,
        preferred: this.wishlist.preferred,
      });
    }
  }

  /** Emits the wishlist data, when the form was valid. */
  submitWishlistForm() {
    if (this.wishListForm.valid) {
      this.submit.emit({
        id: !this.wishlist ? this.wishListForm.get('title').value : this.wishlistTitle,
        preferred: this.wishListForm.get('preferred').value,
        title: this.wishListForm.get('title').value,
        public: false,
      });

      this.hide();
    } else {
      this.submitted = true;
      markAsDirtyRecursive(this.wishListForm);
    }
  }

  /** Opens the modal. */
  show() {
    this.modal = this.ngbModal.open(this.modalTemplate);
  }

  /** Close the modal. */
  hide() {
    this.wishListForm.reset({
      title: '',
      preferred: false,
    });
    this.submitted = false;
    if (this.modal) {
      this.modal.close();
    }
  }

  get formDisabled() {
    return this.wishListForm.invalid && this.submitted;
  }
}
