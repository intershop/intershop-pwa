import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgbModalModule, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { spy, verify } from 'ts-mockito';

import { CheckboxComponent } from 'ish-shared/forms/components/checkbox/checkbox.component';
import { InputComponent } from 'ish-shared/forms/components/input/input.component';

import { OrderTemplatePreferencesDialogComponent } from './order-template-preferences-dialog.component';

describe('Order Template Preferences Dialog Component', () => {
  let component: OrderTemplatePreferencesDialogComponent;
  let fixture: ComponentFixture<OrderTemplatePreferencesDialogComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MockComponent(CheckboxComponent),
        MockComponent(FaIconComponent),
        MockComponent(InputComponent),
        OrderTemplatePreferencesDialogComponent,
      ],
      imports: [NgbModalModule, NgbPopoverModule, ReactiveFormsModule, TranslateModule.forRoot()],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderTemplatePreferencesDialogComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should emit new order template data when submit form was called and the form was valid', done => {
    fixture.detectChanges();
    component.orderTemplateForm.setValue({
      title: 'test order template',
    });

    component.submit.subscribe(emit => {
      expect(emit).toEqual({
        id: 'test order template',
        title: 'test order template',
      });
      done();
    });

    component.submitOrderTemplateForm();
  });

  it('should not emit new order template data when submit form was called and the form was invalid', () => {
    component.ngOnChanges();
    fixture.detectChanges();
    const emitter = spy(component.submit);
    component.submitOrderTemplateForm();

    verify(emitter.emit()).never();
  });
});
