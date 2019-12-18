import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Contact } from 'ish-core/models/contact/contact.model';
import { User } from 'ish-core/models/user/user.model';
import { SelectOption } from 'ish-shared/forms/components/select/select.component';
import { markAsDirtyRecursive } from 'ish-shared/forms/utils/form-utils';

/**
 * The Contact Form Component show the customer a form to contact the shop
 *
 * @example
 * <ish-contact-form [subjects]="contactSubjects" (request)="sendRequest($event)"></ish-contact-form>
 */
@Component({
  selector: 'ish-contact-form',
  templateUrl: './contact-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactFormComponent implements OnChanges, OnInit {
  /** Possible subjects to show to the customer in a select box. */
  @Input() subjects: string[] = [];
  @Input() user: User;
  /** The contact request to send. */
  @Output() request = new EventEmitter<{ contact: Contact; captcha?: string }>();

  subjectOptions: SelectOption[];

  /** The form for customer message to the shop. */
  contactForm: FormGroup;
  submitted = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.initForm();
  }

  ngOnChanges() {
    this.subjectOptions = this.mapSubjectOptions(this.subjects);
  }

  /** emit contact request, when for is valid or mark form as dirty, when form is invalid */
  submitForm() {
    if (this.contactForm.valid) {
      const formValue = this.contactForm.value;
      const contact: Contact = {
        name: formValue.name,
        email: formValue.email,
        phone: formValue.phone,
        subject: formValue.subject,
        comment: formValue.comments,
        order: formValue.order,
      };

      /* ToDo: send captcha data if captcha is supported by REST, see #IS-28299 */
      this.request.emit({ contact });
    } else {
      markAsDirtyRecursive(this.contactForm);
      this.submitted = true;
    }
  }

  /** map subjects to select box options */
  private mapSubjectOptions(subjects: string[]): SelectOption[] {
    return subjects.map(subject => ({ value: subject, label: subject }));
  }

  private initForm() {
    const name = this.user && `${this.user.firstName} ${this.user.lastName}`;
    const email = this.user && this.user.email;
    const phone = this.user && (this.user.phoneBusiness || this.user.phoneMobile || this.user.phoneHome);

    this.contactForm = this.fb.group({
      name: [name, Validators.required],
      email: [email, [Validators.required, Validators.email]],
      phone: [phone, Validators.required],
      order: [''],
      subject: ['', Validators.required],
      comments: ['', Validators.required],
      captcha: [''],
      captchaAction: ['contact_us'],
    });
  }

  /** return boolean to set submit button enabled/disabled */
  get formDisabled(): boolean {
    return this.contactForm.invalid && this.submitted;
  }
}
