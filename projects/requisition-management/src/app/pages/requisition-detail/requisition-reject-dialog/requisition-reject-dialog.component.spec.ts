import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { anything, capture, spy, verify } from 'ts-mockito';

import { TextareaComponent } from 'ish-shared/forms/components/textarea/textarea.component';

import { RequisitionRejectDialogComponent } from './requisition-reject-dialog.component';

describe('Requisition Reject Dialog Component', () => {
  let component: RequisitionRejectDialogComponent;
  let fixture: ComponentFixture<RequisitionRejectDialogComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MockComponent(TextareaComponent), RequisitionRejectDialogComponent],
      imports: [ReactiveFormsModule, TranslateModule.forRoot()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequisitionRejectDialogComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should emit approval comment when submit form was called and the form was valid', () => {
    fixture.detectChanges();
    component.rejectForm.setValue({
      comment: 'test comment',
    });

    const emitter = spy(component.submit);
    component.submitForm();

    verify(emitter.emit(anything())).once();
    const [arg] = capture(emitter.emit).last();
    expect(arg).toMatchInlineSnapshot(`"test comment"`);
  });

  it('should not emit new approval comment when submit form was called and the form was invalid', () => {
    fixture.detectChanges();
    const emitter = spy(component.submit);
    component.submitForm();

    verify(emitter.emit()).never();
  });
});
