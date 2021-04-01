import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { SelectOption } from 'ish-shared/forms/components/select/select.component';
import { markAsDirtyRecursive } from 'ish-shared/forms/utils/form-utils';

import { WishlistsFacade } from '../../facades/wishlists.facade';
import { Wishlist } from '../../models/wishlist/wishlist.model';

/**
 * The wishlist select modal displays a list of wishlists. The user can select one wishlist or enter a name for a new wishlist in order to add or move an item to a the selected wishlist.
 */
@Component({
  selector: 'ish-select-wishlist-modal',
  templateUrl: './select-wishlist-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectWishlistModalComponent implements OnInit, OnDestroy {
  /**
   * changes the some logic and the translations keys between add or move a product (default: 'add')
   */
  @Input() addMoveProduct: 'add' | 'move' = 'add';

  /**
   * submit successfull event
   */
  @Output() submitEmitter = new EventEmitter<{ id: string; title: string }>();

  preferredWishlist: Wishlist;
  updateWishlistForm: FormGroup;
  wishlistOptions: SelectOption[];

  showForm: boolean;
  newWishlistInitValue = '';

  modal: NgbModalRef;

  idAfterCreate = '';
  private destroy$ = new Subject<void>();

  @ViewChild('modal') modalTemplate: TemplateRef<unknown>;

  constructor(
    private ngbModal: NgbModal,
    private fb: FormBuilder,
    private translate: TranslateService,
    private wishlistsFacade: WishlistsFacade
  ) {}

  ngOnInit() {
    this.wishlistsFacade.preferredWishlist$
      .pipe(take(1), takeUntil(this.destroy$))
      .subscribe(wishlist => (this.preferredWishlist = wishlist));
    this.determineSelectOptions();
    this.formInit();
    this.wishlistsFacade.currentWishlist$
      .pipe(takeUntil(this.destroy$))
      .subscribe(wishlist => (this.idAfterCreate = wishlist && wishlist.id));

    this.translate
      .get('account.wishlists.choose_wishlist.new_wishlist_name.initial_value')
      .pipe(take(1), takeUntil(this.destroy$))
      .subscribe(res => {
        this.newWishlistInitValue = res;
        this.setDefaultFormValues();
      });
    this.updateWishlistForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(changes => {
      if (changes.wishlist !== 'newList') {
        this.updateWishlistForm.get('newWishlist').clearValidators();
      } else {
        this.updateWishlistForm.get('newWishlist').setValidators(Validators.required);
      }
      this.updateWishlistForm.get('newWishlist').updateValueAndValidity({ emitEvent: false });
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private formInit() {
    this.updateWishlistForm = this.fb.group({
      wishlist: [
        this.wishlistOptions && this.wishlistOptions.length > 0 ? this.wishlistOptions[0].value : 'newList',
        Validators.required,
      ],
      newWishlist: [this.newWishlistInitValue, Validators.required],
    });
  }

  private determineSelectOptions() {
    let currentWishlist: Wishlist;
    this.wishlistsFacade.currentWishlist$.pipe(take(1), takeUntil(this.destroy$)).subscribe(w => (currentWishlist = w));
    this.wishlistsFacade.wishlists$.pipe(takeUntil(this.destroy$)).subscribe(wishlists => {
      if (wishlists && wishlists.length > 0) {
        this.wishlistOptions = wishlists.map(wishlist => ({
          value: wishlist.id,
          label: wishlist.title,
        }));
        if (this.addMoveProduct === 'move' && currentWishlist) {
          this.wishlistOptions = this.wishlistOptions.filter(option => option.value !== currentWishlist.id);
        }
      } else {
        this.wishlistOptions = [];
      }
      this.setDefaultFormValues();
      this.addProductToPreferredWishlist();
    });
  }

  private setDefaultFormValues() {
    if (this.showForm && !this.addProductToPreferredWishlist()) {
      if (this.wishlistOptions && this.wishlistOptions.length > 0) {
        if (this.preferredWishlist) {
          this.updateWishlistForm.get('wishlist').setValue(this.preferredWishlist.id);
        } else {
          this.updateWishlistForm.get('wishlist').setValue(this.wishlistOptions[0].value);
        }
      } else {
        this.updateWishlistForm.get('wishlist').setValue('newList');
      }
      this.updateWishlistForm.get('newWishlist').setValue(this.newWishlistInitValue);
    }
  }

  /** don't show wishlist selection form but add a product immediately if there is a preferred wishlist */
  private addProductToPreferredWishlist(): boolean {
    if (this.showForm && this.preferredWishlist && this.addMoveProduct === 'add') {
      this.updateWishlistForm.get('wishlist').setValue(this.preferredWishlist.id);
      this.submitForm();
      return true;
    }
    return false;
  }

  /** emit results when the form is valid */
  submitForm() {
    if (this.updateWishlistForm.valid) {
      const wishlistId = this.updateWishlistForm.get('wishlist').value;
      this.submitEmitter.emit({
        id: wishlistId !== 'newList' ? wishlistId : undefined,
        title:
          wishlistId !== 'newList'
            ? this.wishlistOptions.find(option => option.value === wishlistId).label
            : this.updateWishlistForm.get('newWishlist').value,
      });
      this.showForm = false;
    } else {
      markAsDirtyRecursive(this.updateWishlistForm);
    }
  }

  /** close modal */
  hide() {
    this.modal.close();
  }

  /** open modal */
  show() {
    this.showForm = true;
    this.setDefaultFormValues();
    this.modal = this.ngbModal.open(this.modalTemplate);
  }

  /**
   * Callback function to hide modal dialog (used with ishServerHtml). - is needed for closing the dialog after the user clicks a message link
   */
  get callbackHideDialogModal() {
    return () => {
      this.hide();
    };
  }

  get selectedWishlistTitle(): string {
    const selectedValue = this.updateWishlistForm.get('wishlist').value;
    if (selectedValue === 'newList') {
      return this.updateWishlistForm.get('newWishlist').value;
    } else {
      return this.wishlistOptions.find(wishlist => wishlist.value === selectedValue).label;
    }
  }

  /** returns the route to the selected wishlist */
  get selectedWishlistRoute(): string {
    const selectedValue = this.updateWishlistForm.get('wishlist').value;
    if (selectedValue === 'newList') {
      return `route://account/wishlists/${this.idAfterCreate}`;
    } else {
      return `route://account/wishlists/${selectedValue}`;
    }
  }

  /** activates the input field to create a new wishlist */
  get newWishlistDisabled() {
    const selectedWishlist = this.updateWishlistForm.get('wishlist').value;
    return selectedWishlist !== 'newList';
  }

  /** translation key for the modal header */
  get headerTranslationKey() {
    return this.addMoveProduct === 'add'
      ? 'product.add_to_wishlist.link'
      : 'account.wishlist.table.options.move_to_another_wishlist';
  }

  /** translation key for the submit button */
  get submitButtonTranslationKey() {
    return this.addMoveProduct === 'add'
      ? 'account.wishlists.add_to_wishlist.add_button.text'
      : 'account.wishlists.move_wishlist_item.move_button.text';
  }

  /** translation key for the success text */
  get successTranslationKey() {
    return this.addMoveProduct === 'add'
      ? 'account.wishlists.add_to_wishlist.confirmation'
      : 'account.wishlists.move_wishlist_item.confirmation';
  }
}
