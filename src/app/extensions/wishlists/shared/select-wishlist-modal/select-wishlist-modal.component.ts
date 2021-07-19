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
import { FormGroup } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Observable, Subject, of } from 'rxjs';
import { filter, map, startWith, take, takeUntil, withLatestFrom } from 'rxjs/operators';

import { whenTruthy } from 'ish-core/utils/operators';
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
  changeDetection: ChangeDetectionStrategy.Default,
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

  formGroup: FormGroup = new FormGroup({});
  model: { wishlist?: string; newList?: string } = {};
  multipleFieldConfig$: Observable<FormlyFieldConfig[]>;
  singleFieldConfig: FormlyFieldConfig[];

  showForm: boolean;

  modal: NgbModalRef;

  private destroy$ = new Subject<void>();

  @ViewChild('modal') modalTemplate: TemplateRef<unknown>;

  constructor(private ngbModal: NgbModal, private wishlistsFacade: WishlistsFacade) {}

  ngOnInit() {
    this.singleFieldConfig = [
      {
        type: 'ish-text-input-field',
        key: 'newList',
        templateOptions: {
          required: true,
          placeholder: 'account.wishlists.choose_wishlist.new_wishlist_name.initial_value',
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

    this.multipleFieldConfig$ = this.wishlistOptions$.pipe(
      map(wishlistOptions =>
        wishlistOptions.map(option => ({
          type: 'ish-radio-field',
          key: 'wishlist',
          id: 'wishlist',
          defaultValue: wishlistOptions[0].value,
          templateOptions: {
            value: option.value,
            label: option.label,
          },
        }))
      ),
      map(formlyConfig => [
        ...formlyConfig,
        {
          fieldGroupClassName: 'radio',
          fieldGroup: [
            {
              type: 'ish-radio-field',
              wrappers: [],
              key: 'wishlist',
              id: 'wishlist',
              templateOptions: {
                value: 'new',
              },
            },
            {
              type: 'ish-text-input-field',
              key: 'newList',
              wrappers: ['validation'],
              templateOptions: {
                required: true,
                placeholder: 'account.wishlists.choose_wishlist.new_wishlist_name.initial_value',
              },
              validation: {
                messages: {
                  required: 'account.wishlist.name.error.required',
                },
              },
              expressionProperties: {
                'templateOptions.disabled': model => model.wishlist !== 'new',
              },
            },
          ],
        },
      ])
    );
  }

  /** emit results when the form is valid */
  submitForm() {
    const radioButtons = { ...this.model, ...this.formGroup.value };
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
    this.formGroup.reset();
  }

  /** open modal */
  show() {
    this.showForm = true;
    this.modal = this.ngbModal.open(this.modalTemplate);

    this.wishlistsFacade.preferredWishlist$
      .pipe(whenTruthy(), take(1), takeUntil(this.destroy$))
      .subscribe(preferredWishlist => {
        // don't show wishlist selection form but add a product immediately if there is a preferred wishlist
        if (this.addMoveProduct === 'add') {
          this.model = {
            ...this.model,
            wishlist: preferredWishlist.id,
          };
          this.submitForm();
        } else {
          // set default form value  preferred wishlist
          this.model = {
            ...this.model,
            wishlist: preferredWishlist.id,
          };
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
    const selectedValue = this.formGroup.value.wishlist ?? this.model.wishlist;
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
    const selectedValue = this.formGroup.get('wishlist')?.value ?? this.model.wishlist;
    if (selectedValue === 'new' || !selectedValue) {
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

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
