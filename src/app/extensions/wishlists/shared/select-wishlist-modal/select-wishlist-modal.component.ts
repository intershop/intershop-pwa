import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { filter, map, take, withLatestFrom } from 'rxjs/operators';

import { SelectOption } from 'ish-core/models/select-option/select-option.model';
import { whenTruthy } from 'ish-core/utils/operators';
import { markAsDirtyRecursive } from 'ish-shared/forms/utils/form-utils';

import { WishlistsFacade } from '../../facades/wishlists.facade';

/**
 * The wishlist select modal displays a list of wishlists. The user can select one wishlist or enter a name for a new wishlist in order to add or move an item to a the selected wishlist.
 */
@Component({
  selector: 'ish-select-wishlist-modal',
  templateUrl: './select-wishlist-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectWishlistModalComponent implements OnInit {
  /**
   * changes the some logic and the translations keys between add or move a product (default: 'add')
   */
  @Input() addMoveProduct: 'add' | 'move' = 'add';

  /**
   * submit successful event
   */
  @Output() submitEmitter = new EventEmitter<{ id: string; title: string }>();

  private wishlistOptions$: Observable<SelectOption[]>;

  formGroup: FormGroup = new FormGroup({
    wishlist: new FormControl(''),
    newList: new FormControl(''),
  });

  showForm: boolean;

  modal: NgbModalRef;

  private destroyRef = inject(DestroyRef);

  @ViewChild('modal') modalTemplate: TemplateRef<unknown>;

  constructor(private ngbModal: NgbModal, private wishlistsFacade: WishlistsFacade) {}

  ngOnInit() {
    this.wishlistOptions$ = this.wishlistsFacade.wishlistSelectOptions$(this.addMoveProduct === 'move');
  }

  /** emit results when the form is valid */
  submitForm() {
    const radioButtons = this.formGroup.value;
    if (radioButtons?.wishlist && radioButtons.wishlist !== 'new') {
      if (this.formGroup.valid) {
        this.submitExisting(radioButtons.wishlist);
      } else {
        markAsDirtyRecursive(this.formGroup);
      }
    } else if (radioButtons.newList && this.formGroup.valid) {
      this.submitNew(radioButtons.newList);
    } else {
      markAsDirtyRecursive(this.formGroup);
    }
  }

  private submitExisting(wishlistId: string) {
    this.wishlistOptions$
      .pipe(
        filter(options => options.length > 0),
        map(options => options.find(option => option.value === wishlistId).label),
        take(1),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(label => {
        this.submitEmitter.emit({
          id: wishlistId,
          title: label,
        });
        this.showForm = false;
      });
  }

  private submitNew(newList: string) {
    this.submitEmitter.emit({
      id: undefined,
      title: newList,
    });
    this.showForm = false;
  }

  /** close modal */
  hide() {
    this.modal.close();
    this.formGroup.reset();
  }

  /** open modal */
  show() {
    this.showForm = true;
    this.modal = this.ngbModal.open(this.modalTemplate);

    this.wishlistsFacade.preferredWishlist$
      .pipe(
        whenTruthy(),
        take(1),
        withLatestFrom(this.wishlistsFacade.currentWishlist$),
        map(([preferredWishlist, selectedWishlist]) => ({ preferredWishlist, selectedWishlist })),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(data => {
        // don't show wishlist selection form but add a product immediately if there is a preferred wishlist
        if (this.addMoveProduct === 'add') {
          this.formGroup.patchValue({ wishlist: data.preferredWishlist.id });
          this.submitForm();
        } else {
          // set default form value to preferred wishlist unless the current wishlist is the preferred one
          if (data.preferredWishlist.id !== data.selectedWishlist.id) {
            this.formGroup.patchValue({ wishlist: data.preferredWishlist.id });
          }
        }
      });
  }

  /**
   * Callback function to hide modal dialog (used with ishServerHtml). - is needed for closing the dialog after the user clicks a message link
   */
  get callbackHideDialogModal() {
    return () => {
      this.hide();
    };
  }

  get selectedWishlistTitle$(): Observable<string> {
    const selectedValue = this.formGroup.value.wishlist;
    if (selectedValue === 'new' || !selectedValue) {
      return of(this.formGroup.value.newList);
    } else {
      return this.wishlistOptions$.pipe(
        filter(options => options.length > 0),
        map(options => options.find(opt => opt.value === selectedValue).label),
        take(1)
      );
    }
  }

  /** returns the route to the selected wishlist */
  get selectedWishlistRoute$(): Observable<string> {
    const selectedValue = this.formGroup.get('wishlist')?.value;
    if (selectedValue === 'new' || !selectedValue) {
      return this.wishlistsFacade.currentWishlist$.pipe(
        map(currentWishlist => `route://account/wishlists/${currentWishlist?.id}`),
        take(1)
      );
    } else {
      return of(`route://account/wishlists/${selectedValue}`);
    }
  }

  /** translation key for the modal header */
  get headerTranslationKey() {
    return this.addMoveProduct === 'add'
      ? 'product.add_to_wishlist.link'
      : 'wishlist.table.options.move_to_another_wishlist';
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
