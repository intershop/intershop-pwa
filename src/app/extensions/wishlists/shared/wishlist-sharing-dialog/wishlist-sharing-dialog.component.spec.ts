import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe, provideTranslateService } from '@ngx-translate/core';
import { MockComponent, MockDirective } from 'ng-mocks';
import { anything, capture, spy, verify } from 'ts-mockito';

import { FormSubmitDirective } from 'ish-core/directives/form-submit.directive';
import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { ModalDialogComponent } from 'ish-shared/components/common/modal-dialog/modal-dialog.component';
import { FormlyTestingModule } from 'ish-shared/formly/dev/testing/formly-testing.module';

import { WishlistSharingDialogComponent } from './wishlist-sharing-dialog.component';

describe('Wishlist Sharing Dialog Component', () => {
  let component: WishlistSharingDialogComponent;
  let fixture: ComponentFixture<WishlistSharingDialogComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormlyTestingModule, ReactiveFormsModule, TranslatePipe],
      declarations: [
        MockComponent(ModalDialogComponent),
        MockDirective(FormSubmitDirective),
        MockDirective(ServerHtmlDirective),
        WishlistSharingDialogComponent,
      ],
      providers: [provideTranslateService()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WishlistSharingDialogComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should emit wishlist sharing data when form is submitted and valid', () => {
    component.show();
    const recipientEmails = 'test@example.com';
    const personalMessage = 'Test message';

    component.wishListForm.setControl('friendEmails', new FormControl(recipientEmails));
    component.wishListForm.setControl('personalMessage', new FormControl(personalMessage));

    const emitter = spy(component.submitWishlistSharing);

    component.submitWishlistForm();

    verify(emitter.emit(anything())).once();
    const [arg] = capture(emitter.emit).last();
    expect(arg).toEqual({ recipients: recipientEmails, message: personalMessage });
    expect(component.wishListForm.valid).toBeTrue();
  });

  it('should not emit wishlist sharing data when form is submitted and invalid', () => {
    component.wishListForm.setControl('friendEmails', new FormControl('', [Validators.required]));
    component.wishListForm.setControl('personalMessage', new FormControl(''));

    const emitter = spy(component.submitWishlistSharing);

    component.submitWishlistForm();

    verify(emitter.emit(anything())).never();
    expect(component.wishListForm.invalid).toBeTrue();
  });
});
