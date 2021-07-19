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
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs';
import { map, startWith, take, takeUntil, withLatestFrom } from 'rxjs/operators';

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
   * submit successful event
   */
  @Output() submitEmitter = new EventEmitter<{ id: string; title: string }>();

  wishlistOptions$: Observable<SelectOption[]>;

  multipleFormGroup: FormGroup = new FormGroup({});
  singleFormGroup: FormGroup = new FormGroup({});
  // model: { wishlist: string };
  newWishlistFC = new FormControl('newList', Validators.required);
  multipleFieldConfig: FormlyFieldConfig[];
  singleFieldConfig: FormlyFieldConfig[];

  showForm: boolean;
  newWishlistInitValue = '';

  modal: NgbModalRef;

  idAfterCreate = '';
  private destroy$ = new Subject<void>();

  @ViewChild('modal') modalTemplate: TemplateRef<unknown>;

  constructor(private ngbModal: NgbModal, private wishlistsFacade: WishlistsFacade) {}

  ngOnInit() {
    this.singleFieldConfig = [
      {
        type: 'ish-text-input-field',
        key: 'new',
        templateOptions: {
          required: true,
        },
        validation: {
          messages: {
            required: 'account.wishlist.name.error.required',
          },
        },
      },
    ];
    this.wishlistOptions$ = this.wishlistsFacade.wishlists$.pipe(
      startWith([] as Wishlist[]),
      map(wishlists =>
        wishlists.map(wishlist => ({
          value: wishlist.id,
          label: wishlist.title,
        }))
      ),
      withLatestFrom(this.wishlistsFacade.currentWishlist$),
      map(([wishlistOptions, currentWishlist]) => {
        if (this.addMoveProduct === 'move' && currentWishlist) {
          return wishlistOptions.filter(option => option.value !== currentWishlist.id);
        }
        return wishlistOptions;
      })
    );

    this.multipleFieldConfig = [
      {
        type: 'radio-buttons-field',
        key: 'wishlist',
        templateOptions: {
          required: true,
          options: this.wishlistOptions$,
          newInput: {
            label: 'account.wishlists.choose_wishlist.new_wishlist_name.initial_value',
            formControl: this.newWishlistFC,
          },
        },
      },
    ];

    this.wishlistsFacade.preferredWishlist$
      .pipe(withLatestFrom(this.wishlistOptions$), take(1), takeUntil(this.destroy$))
      .subscribe(([preferredWishlist, wishlistOptions]) => {
        // don't show wishlist selection form but add a product immediately if there is a preferred wishlist
        if (this.showForm && preferredWishlist && this.addMoveProduct === 'add') {
          this.multipleFormGroup.get('wishlist').setValue(preferredWishlist.id);
          this.submitForm();
        } else if (this.showForm) {
          // set default form value
          if (wishlistOptions && wishlistOptions.length > 0) {
            if (preferredWishlist) {
              this.multipleFormGroup.get('wishlist').setValue(preferredWishlist.id);
            } else {
              this.multipleFormGroup.get('wishlist').setValue(wishlistOptions[0].value);
            }
          } else {
            this.multipleFormGroup.get('wishlist').setValue('new');
          }
        }
      });

    this.wishlistsFacade.currentWishlist$
      .pipe(takeUntil(this.destroy$))
      .subscribe(wishlist => (this.idAfterCreate = wishlist && wishlist.id));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /** emit results when the form is valid */
  submitForm() {
    console.log(this.multipleFormGroup.value);
    if (this.multipleFormGroup.valid) {
      const newWishlist = this.multipleFormGroup.get('new')?.value ?? this.newWishlistFC.value;
      console.log(newWishlist);
      if (newWishlist) {
        this.multipleFormGroup.get('wishlist')?.setValue('new');
      }
      const wishlistId = this.multipleFormGroup.get('wishlist')?.value;

      this.submitEmitter.emit({
        id: wishlistId !== 'new' ? wishlistId : undefined,
        title:
          wishlistId !== 'new'
            ? wishlistId // this.wishlistOptions.find(option => option.value === wishlistId).label
            : newWishlist,
      });
      this.showForm = false;
    } else {
      console.log(';invalid');
      markAsDirtyRecursive(this.multipleFormGroup);
    }
  }

  /** close modal */
  hide() {
    this.modal.close();
  }

  /** open modal */
  show() {
    this.showForm = true;
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
    const selectedValue = this.multipleFormGroup.get('wishlist').value;
    if (selectedValue === 'newList') {
      return this.newWishlistFC.value;
    } else {
      return selectedValue; // this.wishlistOptions.find(wishlist => wishlist.value === selectedValue).label;
    }
  }

  /** returns the route to the selected wishlist */
  get selectedWishlistRoute(): string {
    const selectedValue = this.multipleFormGroup.get('wishlist').value;
    if (selectedValue === 'newList') {
      return `route://account/wishlists/${this.idAfterCreate}`;
    } else {
      return `route://account/wishlists/${selectedValue}`;
    }
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
