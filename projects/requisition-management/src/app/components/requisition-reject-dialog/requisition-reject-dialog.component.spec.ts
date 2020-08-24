import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { spy, verify } from 'ts-mockito';

import { TextareaComponent } from 'ish-shared/forms/components/textarea/textarea.component';

import { RequisitionRejectDialogComponent } from './requisition-reject-dialog.component';

describe('Requisition Reject Dialog Component', () => {
  let component: RequisitionRejectDialogComponent;
  let fixture: ComponentFixture<RequisitionRejectDialogComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MockComponent(TextareaComponent), RequisitionRejectDialogComponent],
      imports: [NgbModalModule, ReactiveFormsModule, TranslateModule.forRoot()],
    }).compileComponents();
  }));

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

  it('should emit approval comment when submit form was called and the form was valid', done => {
    fixture.detectChanges();
    component.rejectForm.setValue({
      comment: 'test comment',
    });

    component.submit.subscribe(emit => {
      expect(emit).toEqual('test comment');
      done();
    });

    component.submitForm();
  });

  it('should not emit new approval comment when submit form was called and the form was invalid', () => {
    fixture.detectChanges();
    const emitter = spy(component.submit);
    component.submitForm();

    verify(emitter.emit()).never();
  });
});
