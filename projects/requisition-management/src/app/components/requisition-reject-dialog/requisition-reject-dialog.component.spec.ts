import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormlyForm } from '@ngx-formly/core';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { MockComponent, MockDirective } from 'ng-mocks';
import { anything, capture, instance, mock, spy, verify } from 'ts-mockito';

import { ModalDialogComponent } from 'ish-shared/components/common/modal-dialog/modal-dialog.component';
import { FormlyTestingModule } from 'ish-shared/formly/dev/testing/formly-testing.module';

import { FormSubmitDirective } from 'ish-core/directives/form-submit.directive';

import { RequisitionRejectDialogComponent } from './requisition-reject-dialog.component';

describe('Requisition Reject Dialog Component', () => {
  let component: RequisitionRejectDialogComponent;
  let fixture: ComponentFixture<RequisitionRejectDialogComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormlyTestingModule, ReactiveFormsModule, TranslateModule.forRoot()],
      declarations: [MockComponent(ModalDialogComponent), RequisitionRejectDialogComponent],
    }).compileComponents();
  });

  beforeEach(async () => {
    const ngbModal = mock(NgbModal);

    await TestBed.configureTestingModule({
      imports: [RequisitionRejectDialogComponent, MockComponent(ModalDialogComponent), TranslateModule.forRoot()],
    })
      .overrideComponent(RequisitionRejectDialogComponent, {
        set: {
          imports: [MockDirective(FormSubmitDirective), MockComponent(FormlyForm), ReactiveFormsModule, TranslatePipe],
        },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequisitionRejectDialogComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    component.rejectForm.addControl('comment', new FormControl(undefined, Validators.required));
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should emit approval comment when submit form was called and the form was valid', () => {
    fixture.detectChanges();
    component.show();
    component.rejectForm.setValue({
      comment: 'test comment',
    });

    const emitter = spy(component.submitRejectRequisition);
    component.submitForm();

    verify(emitter.emit(anything())).once();
    const [arg] = capture(emitter.emit).last();
    expect(arg).toMatchInlineSnapshot(`"test comment"`);
  });

  it('should not emit new approval comment when submit form was called and the form was invalid', () => {
    fixture.detectChanges();
    const emitter = spy(component.submitRejectRequisition);
    component.submitForm();

    verify(emitter.emit(anything())).never();
  });
});
