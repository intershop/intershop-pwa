import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { map, shareReplay, startWith, withLatestFrom } from 'rxjs/operators';

import { FormSubmitDirective } from 'ish-core/directives/form-submit.directive';
import { AccountFacade } from 'ish-core/facades/account.facade';
import { AppFacade } from 'ish-core/facades/app.facade';
import { Contact } from 'ish-core/models/contact/contact.model';

import { ContactUsFacade } from '../../../facades/contact-us.facade';

/**
 * The Contact Form Component show the customer a form to contact the shop
 *
 * @example
 * <ish-contact-form (request)="sendRequest($event)" />
 */
@Component({
  selector: 'ish-contact-form',
  templateUrl: './contact-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [AsyncPipe, FormSubmitDirective, FormlyModule, NgIf, ReactiveFormsModule, TranslatePipe],
})
export class ContactFormComponent implements OnInit {
  /** The contact request to send. */
  @Output() readonly request = new EventEmitter<Contact>();

  /** The form for customer message to the shop. */
  contactForm = new UntypedFormGroup({});
  model$: Observable<Partial<Contact>>;
  fields$: Observable<FormlyFieldConfig[]>;

  constructor(
    private accountFacade: AccountFacade,
    private appFacade: AppFacade,
    private contactUsFacade: ContactUsFacade
  ) {}

  ngOnInit() {
    this.model$ = this.accountFacade.user$.pipe(
      map(user => ({
        name: user && `${user.firstName} ${user.lastName}`,
        email: user?.email,
        phone: user && (user.phoneBusiness || user.phoneMobile || user.phoneHome),
      }))
    );

    this.fields$ = this.accountFacade.isLoggedIn$.pipe(
      withLatestFrom(
        this.appFacade.serverSetting$<boolean>('services.ReCaptchaV2ServiceDefinition.runnable'),
        this.appFacade.serverSetting$<boolean>('captcha.contactUs')
      ),
      map(([isLoggedIn, isCaptchaV2, isCaptchaTopicEnabled]) => [
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
            readonly: isLoggedIn,
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
            required: isCaptchaV2 && isCaptchaTopicEnabled,
            fieldClass: 'offset-md-4 col-md-8',
          },
        },
      ])
    );
  }

  /** emit contact request on submit */
  submitForm() {
    if (this.contactForm.valid) {
      this.request.emit(this.contactForm.value);
    }
  }
}
