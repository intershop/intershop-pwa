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
import { pick } from 'lodash-es';

import { markAsDirtyRecursive } from 'ish-shared/forms/utils/form-utils';

import { Wishlist } from '../../models/wishlist/wishlist.model';

/**
 * The Wishlist Preferences Dialog shows the modal to create/edit a wishlist.
 *
 * @example
 * <ish-account-wishlist-preferences-dialog
    [wishlist]="wishlist"
    (submitWishlist)="createWishlist($event)">
   </ish-account-wishlist-preferences-dialog>
 */
@Component({
  selector: 'ish-wishlist-preferences-dialog',
  templateUrl: './wishlist-preferences-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WishlistPreferencesDialogComponent implements OnInit {
  /**
   * Predefined wishlist to fill the form with, if there is no wishlist a new wishlist will be created
   */
  @Input() wishlist: Wishlist;

  /**
   * Emits the data of the new wishlist to create.
   */
  @Output() submitWishlist = new EventEmitter<Wishlist>();

  wishListForm = new FormGroup({});
  model: Partial<Wishlist> = { preferred: false };
  fields: FormlyFieldConfig[];
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

  constructor(private ngbModal: NgbModal) {}

  ngOnInit() {
    this.fields = [
      {
        key: 'title',
        type: 'ish-text-input-field',
        templateOptions: {
          required: true,
          label: 'account.wishlists.wishlist_form.name.label',
          hideRequiredMarker: true,
          maxLength: 35,
        },
        validation: {
          messages: { required: 'account.wishlists.wishlist_form.name.error.required' },
        },
      },
      {
        key: 'preferred',
        type: 'ish-checkbox-field',
        templateOptions: {
          label: 'account.wishlists.wishlist_form.preferred.label',
          fieldClass: 'offset-md-4 col-md-8 d-flex align-items-center',
          tooltip: {
            link: 'account.wishlists.wishlist_form.preferred.tooltip.linktext',
            text: 'account.wishlists.wishlist_form.preferred.tooltip.content',
            title: 'account.wishlists.wishlist_form.preferred.tooltip.headline',
            class: 'details-tooltip',
          },
        },
      },
    ];

    if (this.wishlist) {
      this.primaryButton = 'account.wishlists.edit_wishlist_form.save_button.text';
      this.wishlistTitle = this.wishlist.title;
      this.modalHeader = 'account.wishlist.list.edit';
    }
  }

  /** Emits the wishlist data, when the form was valid. */
  submitWishlistForm() {
    if (this.wishListForm.invalid) {
      this.submitted = true;
      markAsDirtyRecursive(this.wishListForm);
      return;
    }

    this.submitWishlist.emit({
      id: !this.wishlist ? this.model.title : this.wishlistTitle,
      preferred: this.model.preferred,
      title: this.model.title,
      public: false,
    });
    this.hide();
  }

  /** Opens the modal. */
  show() {
    if (!this.wishlist) {
      this.model = { preferred: false };
    } else {
      this.model = pick(this.wishlist, 'title', 'preferred');
    }
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
