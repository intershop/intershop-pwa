import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { Contact } from 'ish-core/models/contact/contact.model';
import { markAsDirtyRecursive } from 'ish-shared/forms/utils/form-utils';

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

  /** The form for customer message to the shop. */
  submitted = false;
  contactForm = new FormGroup({});
  model$: Observable<Partial<Contact>>;
  fields: FormlyFieldConfig[];

  constructor(private accountFacade: AccountFacade) {}

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
        templateOptions: {
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
        templateOptions: {
          label: 'helpdesk.contactus.email.label',
          required: true,
        },
        validation: {
          messages: {
            required: 'helpdesk.contactus.email.error',
          },
        },
      },
      {
        key: 'phone',
        type: 'ish-text-input-field',
        templateOptions: {
          label: 'helpdesk.contactus.phone.label',
          required: true,
        },
        validation: {
          messages: {
            required: 'helpdesk.contactus.phone.error',
          },
        },
      },
      {
        key: 'order',
        type: 'ish-text-input-field',
        templateOptions: {
          label: 'helpdesk.contactus.order.label',
        },
      },
      {
        key: 'subject',
        type: 'ish-select-field',
        templateOptions: {
          label: 'helpdesk.contactus.subject.label',
          required: true,
          options: this.accountFacade.contactSubjects$().pipe(
            startWith([] as string[]),
            map(subjects => subjects.map(subject => ({ value: subject, label: subject })))
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
        templateOptions: {
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
        templateOptions: {
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
      this.submitted = true;
    }
  }

  /** return boolean to set submit button enabled/disabled */
  get formDisabled(): boolean {
    return this.contactForm.invalid && this.submitted;
  }
}
