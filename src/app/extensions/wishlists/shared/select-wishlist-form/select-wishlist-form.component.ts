import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { SelectOption } from 'ish-core/models/select-option/select-option.model';
import { SpecialValidators } from 'ish-shared/forms/validators/special-validators';

import { WishlistsFacade } from '../../facades/wishlists.facade';

@Component({
  selector: 'ish-select-wishlist-form',
  templateUrl: './select-wishlist-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectWishlistFormComponent implements OnInit {
  @Input({ required: true }) formGroup: FormGroup;
  /**
   * changes the some logic and the translations keys between add or move a product (default: 'add')
   */
  @Input() addMoveProduct: 'add' | 'move' = 'add';

  singleFieldConfig: FormlyFieldConfig[];
  multipleFieldConfig$: Observable<FormlyFieldConfig[]>;
  wishlistOptions$: Observable<SelectOption[]>;

  constructor(private translate: TranslateService, private wishlistFacade: WishlistsFacade) {}

  ngOnInit() {
    this.wishlistOptions$ = this.wishlistFacade.wishlistSelectOptions$(this.addMoveProduct === 'move');

    // formly config for the single input field form (no or no other wishlists exist)
    this.singleFieldConfig = [
      {
        type: 'ish-text-input-field',
        key: 'newList',
        defaultValue: this.translate.instant('account.wishlists.choose_wishlist.new_wishlist_name.initial_value'),
        props: {
          required: true,
          ariaLabel: 'account.wishlists.wishlist_form.name.label',
        },
        validators: {
          validation: [SpecialValidators.noHtmlTags],
        },
        validation: {
          messages: {
            required: 'account.wishlist.name.error.required',
            noHtmlTags: 'account.name.error.forbidden.html.chars',
          },
        },
      },
    ];

    // formly config for the radio button form (one or more other wishlists exist)
    this.multipleFieldConfig$ = this.wishlistOptions$.pipe(
      map(wishlistOptions =>
        wishlistOptions.map(option => ({
          type: 'ish-radio-field',
          key: 'wishlist',
          defaultValue: this.formGroup.get('wishlist')?.value || wishlistOptions[0].value,
          props: {
            fieldClass: ' ',
            value: option.value,
            label: option.label,
          },
        }))
      ),
      map(formlyConfig => [
        ...formlyConfig,
        {
          fieldGroupClassName: 'form-check d-flex',
          fieldGroup: [
            {
              type: 'ish-radio-field',
              key: 'wishlist',
              props: {
                inputClass: 'position-static',
                fieldClass: ' ',
                value: 'new',
              },
            },
            {
              type: 'ish-text-input-field',
              key: 'newList',
              className: 'w-75 position-relative validation-offset-0',
              wrappers: ['validation'],
              defaultValue: this.translate.instant('account.wishlists.choose_wishlist.new_wishlist_name.initial_value'),
              props: {
                required: true,
                ariaLabel: 'account.wishlists.wishlist_form.name.label',
              },
              validators: {
                validation: [SpecialValidators.noHtmlTags],
              },
              validation: {
                messages: {
                  required: 'account.wishlist.name.error.required',
                  noHtmlTags: 'account.name.error.forbidden.html.chars',
                },
              },
              expressions: {
                'props.disabled': conf => conf.model.wishlist !== 'new',
              },
            },
          ],
        },
      ])
    );
  }
}
