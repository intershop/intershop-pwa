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
import { FormControl, FormGroup } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Observable, Subject, of } from 'rxjs';
import { filter, map, startWith, take, takeUntil, withLatestFrom } from 'rxjs/operators';

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

  radioButtonsFormGroup: FormGroup = new FormGroup({});
  newListFormControl: FormControl = new FormControl();

  multipleFieldConfig: FormlyFieldConfig[];
  singleFieldConfig: FormlyFieldConfig[];

  showForm: boolean;

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
          placeholder: 'account.wishlists.choose_wishlist.new_wishlist_name.initial_value',
        },
        formControl: this.newListFormControl,
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
            config: [
              {
                type: 'ish-text-input-field',
                key: 'newList',
                wrappers: ['validation'],
                templateOptions: {
                  required: true,
                  placeholder: 'account.wishlists.choose_wishlist.new_wishlist_name.initial_value',
                },
                formControl: this.newListFormControl,
                validation: {
                  messages: {
                    required: 'account.wishlist.name.error.required',
                  },
                },
              },
            ],
          },
        },
      },
    ];

    this.wishlistsFacade.preferredWishlist$
      .pipe(withLatestFrom(this.wishlistOptions$), take(1), takeUntil(this.destroy$))
      .subscribe(([preferredWishlist, wishlistOptions]) => {
        // don't show wishlist selection form but add a product immediately if there is a preferred wishlist
        if (this.showForm && preferredWishlist && this.addMoveProduct === 'add') {
          this.radioButtonsFormGroup.get('wishlist').setValue(preferredWishlist.id);
          this.submitForm();
        } else if (this.showForm) {
          // set default form value
          if (wishlistOptions && wishlistOptions.length > 0) {
            if (preferredWishlist) {
              this.radioButtonsFormGroup.get('wishlist').setValue(preferredWishlist.id);
            } else {
              this.radioButtonsFormGroup.get('wishlist').setValue(wishlistOptions[0].value);
            }
          } else {
            this.radioButtonsFormGroup.get('wishlist').setValue('new');
          }
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /** emit results when the form is valid */
  submitForm() {
    const radioButtons = this.radioButtonsFormGroup.value;
    const newList = this.newListFormControl.value;
    if (radioButtons && radioButtons !== {} && radioButtons.wishlist !== 'new') {
      if (this.radioButtonsFormGroup.valid) {
        this.submitExisting(radioButtons.wishlist);
      } else {
        markAsDirtyRecursive(this.radioButtonsFormGroup);
      }
    } else if (!this.newListFormControl.invalid) {
      this.submitNew(newList);
    } else {
      this.newListFormControl.markAsDirty();
    }
  }

  submitExisting(wishlistId: string) {
    this.wishlistOptions$
      .pipe(
        filter(options => options.length > 0),
        map(options => options.find(option => option.value === wishlistId).label),
        take(1),
        takeUntil(this.destroy$)
      )
      .subscribe(label => {
        this.submitEmitter.emit({
          id: wishlistId,
          title: label,
        });
        this.showForm = false;
      });
  }

  submitNew(newList: string) {
    this.submitEmitter.emit({
      id: undefined,
      title: newList,
    });
    this.showForm = false;
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

  get selectedWishlistTitle(): Observable<string> {
    const selectedValue = this.radioButtonsFormGroup.get('wishlist').value;
    if (selectedValue === 'new') {
      return of(this.newListFormControl.value);
    } else {
      return this.wishlistOptions$.pipe(
        filter(options => options.length > 0),
        map(options => options.find(opt => opt.value === selectedValue).label),
        take(1)
      );
    }
  }

  /** returns the route to the selected wishlist */
  get selectedWishlistRoute(): Observable<string> {
    const selectedValue = this.radioButtonsFormGroup.get('wishlist').value;
    if (selectedValue === 'new') {
      return this.wishlistsFacade.currentWishlist$.pipe(
        map(currentWishlist => `route://account/wishlists/${currentWishlist && currentWishlist.id}`),
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
