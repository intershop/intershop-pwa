import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Observable } from 'rxjs';
import { map, shareReplay, startWith } from 'rxjs/operators';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { Contact } from 'ish-core/models/contact/contact.model';
import { focusFirstInvalidField, markAsDirtyRecursive } from 'ish-shared/forms/utils/form-utils';

import { ContactUsFacade } from '../../../facades/contact-us.facade';

/**
 * The Contact Form Component show the customer a form to contact the shop
 *
 * @example
 * <ish-contact-form (request)="sendRequest($event)"></ish-contact-form>
 */
@Component({
  selector: 'ish-contact-form',
  templateUrl: './contact-form.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class ContactFormComponent implements OnInit {
  /** The contact request to send. */
  @Output() request = new EventEmitter<Contact>();

  // visible-for-testing
  submitted = false;

  /** The form for customer message to the shop. */
  contactForm = new UntypedFormGroup({});
  model$: Observable<Partial<Contact>>;
  fields: FormlyFieldConfig[];

  constructor(private accountFacade: AccountFacade, private contactUsFacade: ContactUsFacade) {}

  ngOnInit() {
    this.model$ = this.accountFacade.user$.pipe(
      map(user => ({
        name: user && `${user.firstName} ${user.lastName}`,
        email: user?.email,
        phone: user && (user.phoneBusiness || user.phoneMobile || user.phoneHome),
      }))
    );

    this.fields = [
      {
        key: 'name',
        type: 'ish-text-input-field',
        props: {
          label: 'helpdesk.contactus.name.label',
          required: true,
        },
        validation: {
          messages: {
            required: 'helpdesk.contactus.name.error',
          },
        },
      },
      {
        key: 'email',
        type: 'ish-email-field',
        props: {
          label: 'helpdesk.contactus.email.label',
          required: true,
        },
      },
      {
        key: 'phone',
        type: 'ish-phone-field',
        props: {
          label: 'helpdesk.contactus.phone.label',
          required: true,
        },
      },
      {
        key: 'order',
        type: 'ish-text-input-field',
        props: {
          label: 'helpdesk.contactus.order.label',
        },
      },
      {
        key: 'subject',
        type: 'ish-select-field',
        props: {
          label: 'helpdesk.contactus.subject.label',
          required: true,
          options: this.contactUsFacade.contactSubjects$().pipe(
            startWith([] as string[]),
            map(subjects => subjects.map(subject => ({ value: subject, label: subject }))),
            shareReplay(1)
          ),
          placeholder: 'account.option.select.text',
        },
        validation: {
          messages: {
            required: 'helpdesk.contactus.subject.error',
          },
        },
      },
      {
        key: 'comment',
        type: 'ish-textarea-field',
        props: {
          label: 'helpdesk.contactus.comments.label',
          required: true,
          maxLength: 30000,
          rows: 5,
        },
        validation: {
          messages: {
            required: 'helpdesk.contactus.comments.error',
          },
        },
      },
      {
        type: 'ish-captcha-field',
        props: {
          topic: 'contactUs',
        },
      },
    ];
  }

  /** emit contact request, when for is valid or mark form as dirty, when form is invalid */
  submitForm() {
    if (this.contactForm.valid) {
      this.request.emit(this.contactForm.value);
    } else {
      markAsDirtyRecursive(this.contactForm);
      focusFirstInvalidField(this.contactForm);
      this.submitted = true;
    }
  }

  /** return boolean to set submit button enabled/disabled */
  get formDisabled(): boolean {
    return this.contactForm.invalid && this.submitted;
  }
}
