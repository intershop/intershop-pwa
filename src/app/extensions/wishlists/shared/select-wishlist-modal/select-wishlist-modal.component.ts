import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { filter, map, take, withLatestFrom } from 'rxjs/operators';

import { FormSubmitDirective } from 'ish-core/directives/form-submit.directive';
import { ProductContextAccessDirective } from 'ish-core/directives/product-context-access.directive';
import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { SelectOption } from 'ish-core/models/select-option/select-option.model';
import { HtmlEncodePipe } from 'ish-core/pipes/html-encode.pipe';
import { whenTruthy } from 'ish-core/utils/operators';
import { ModalDialogComponent } from 'ish-shared/components/common/modal-dialog/modal-dialog.component';

import { WishlistsFacade } from '../../facades/wishlists.facade';
import { SelectWishlistFormComponent } from '../select-wishlist-form/select-wishlist-form.component';

/**
 * The wishlist select modal displays a list of wishlists. The user can select one wishlist or enter a name for a new wishlist in order to add or move an item to a the selected wishlist.
 */
@Component({
  selector: 'ish-select-wishlist-modal',
  imports: [
    AsyncPipe,
    FormSubmitDirective,
    HtmlEncodePipe,
    ModalDialogComponent,
    ProductContextAccessDirective,
    ReactiveFormsModule,
    SelectWishlistFormComponent,
    ServerHtmlDirective,
    TranslatePipe,
  ],
  standalone: true,
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
  @Output() readonly submitEmitter = new EventEmitter<{ id: string; title: string }>();

  private wishlistOptions$: Observable<SelectOption[]>;

  formGroup: FormGroup = new FormGroup({
    wishlist: new FormControl(''),
    newList: new FormControl(''),
  });

  successWishlistTitle = '';
  successWishlistRoute$: Observable<string> = of('');

  showForm: boolean;

  private destroyRef = inject(DestroyRef);

  @ViewChild('modal') modalDialog: ModalDialogComponent<unknown>;

  constructor(private wishlistsFacade: WishlistsFacade) {}

  ngOnInit() {
    this.wishlistOptions$ = this.wishlistsFacade.wishlistSelectOptions$(this.addMoveProduct === 'move');
  }

  /** emit results when the form is valid */
  submitForm() {
    const radioButtons = this.formGroup.value;
    if (radioButtons?.wishlist && radioButtons.wishlist !== 'new') {
      if (this.formGroup.valid) {
        this.submitExisting(radioButtons.wishlist);
      }
    } else if (radioButtons.newList && this.formGroup.valid) {
      this.submitNew(radioButtons.newList);
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
        this.successWishlistTitle = label;
        this.successWishlistRoute$ = of(`route://account/wishlists/${wishlistId}`);
        this.showForm = false;
      });
  }

  private submitNew(newList: string) {
    this.submitEmitter.emit({
      id: undefined,
      title: newList,
    });
    this.successWishlistTitle = newList;
    this.successWishlistRoute$ = this.wishlistsFacade.currentWishlist$.pipe(
      map(currentWishlist => `route://account/wishlists/${currentWishlist?.id}`),
      take(1)
    );
    this.showForm = false;
  }

  /** close modal */
  hide() {
    this.modalDialog.hide();
    this.formGroup.reset();
  }

  /** open modal */
  show() {
    this.showForm = true;
    this.modalDialog.show();

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
          if (data.preferredWishlist.id !== data.selectedWishlist?.id) {
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
