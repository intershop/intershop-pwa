import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormlyFieldConfig } from '@ngx-formly/core';

import { markAsDirtyRecursive } from 'ish-shared/forms/utils/form-utils';
import { SpecialValidators } from 'ish-shared/forms/validators/special-validators';

import { WishlistSharing } from '../../models/wishlist-sharing/wishlist-sharing.model';
import { Wishlist } from '../../models/wishlist/wishlist.model';

/**
 * The Wishlist Sharing Dialog shows the modal to share a wishlist.
 *
 * @example
 * <ish-wishlist-sharing-dialog
    [wishlist]="wishlist"
    (submitWishlistSharing)="shareWishlist(wishlist.id)">
   </ish-wishlist-sharing-dialog>
 */
@Component({
  selector: 'ish-wishlist-sharing-dialog',
  templateUrl: './wishlist-sharing-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WishlistSharingDialogComponent implements OnInit {
  /**
   * Wishlist that should be shared
   */
  @Input() wishlist: Wishlist;

  /**
   * Emits the data of the wishlist sharing.
   */
  @Output() submitWishlistSharing = new EventEmitter<WishlistSharing>();

  wishListForm = new FormGroup({});
  fields: FormlyFieldConfig[];
  submitted = false;

  /**
   *  A reference to the current modal.
   */
  modal: NgbModalRef;

  primaryButton = 'account.wishlists.wishlist_sharing_form.send_button.text';
  modalHeader = 'account.wishlists.wishlist_sharing_form.heading';

  @ViewChild('modal') modalTemplate: TemplateRef<unknown>;

  constructor(private ngbModal: NgbModal) {}

  ngOnInit() {
    this.fields = [
      {
        key: 'friendEmails',
        type: 'ish-text-input-field',
        props: {
          postWrappers: [{ wrapper: 'description', index: -1 }],
          required: true,
          label: 'account.wishlists.wishlist_sharing_form.friend_mails.label',
          customDescription: {
            key: 'account.wishlists.wishlist_sharing_form.friend_mails.descriptiopn',
          },
          hideRequiredMarker: false,
          maxLength: 256,
        },
        validators: {
          validation: [SpecialValidators.noHtmlTags],
        },
        validation: {
          messages: {
            required: 'account.wishlists.wishlist_sharing_form.friend_mails.error.required',
            noHtmlTags: 'account.name.error.forbidden.html.chars',
          },
        },
      },
      {
        key: 'personalMessage',
        type: 'ish-textarea-field',
        props: {
          required: false,
          label: 'account.wishlists.wishlist_sharing_form.personal_message.label',
          maxLength: 30000,
        },
      },
    ];
  }

  /** Emits the wishlist sharing data, when the form was valid. */
  submitWishlistForm() {
    if (this.wishListForm.invalid) {
      this.submitted = true;
      markAsDirtyRecursive(this.wishListForm);
      return;
    }

    this.submitWishlistSharing.emit({
      name: this.wishlist.title,
      recipients: this.wishListForm.get('friendEmails').value,
      message: this.wishListForm.get('personalMessage').value,
      sender: undefined,
    });

    this.hide();
  }

  /** Opens the modal. */
  show() {
    this.modal = this.ngbModal.open(this.modalTemplate);
  }

  /** Close the modal. */
  hide() {
    this.wishListForm.reset();
    this.submitted = false;
    if (this.modal) {
      this.modal.close();
    }
  }

  get formDisabled() {
    return this.wishListForm.invalid && this.submitted;
  }
}
