import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { anything, capture, spy, verify } from 'ts-mockito';

import { ModalDialogComponent } from 'ish-shared/components/common/modal-dialog/modal-dialog.component';
import { FormlyTestingModule } from 'ish-shared/formly/dev/testing/formly-testing.module';

import { OrderTemplatePreferencesDialogComponent } from './order-template-preferences-dialog.component';

describe('Order Template Preferences Dialog Component', () => {
  let component: OrderTemplatePreferencesDialogComponent;
  let fixture: ComponentFixture<OrderTemplatePreferencesDialogComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormlyTestingModule, ReactiveFormsModule, TranslateModule.forRoot()],
      declarations: [MockComponent(ModalDialogComponent), OrderTemplatePreferencesDialogComponent],
    }).compileComponents();
  });

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

  it('should emit new order template data when submit form was called and the form was valid', () => {
    component.orderTemplate = {
      id: '123456789',
      title: 'test order template',
    };
    fixture.detectChanges();

    const emitter = spy(component.submitOrderTemplate);

    component.submitOrderTemplateForm();

    verify(emitter.emit(anything())).once();
    const [arg] = capture(emitter.emit).last();
    expect(arg).toMatchInlineSnapshot(`
      {
        "id": "test order template",
        "title": "test order template",
      }
    `);
  });

  it('should not emit new order template data when submit form was called and the form was invalid', () => {
    fixture.detectChanges();
    const emitter = spy(component.submitOrderTemplate);
    component.submitOrderTemplateForm();

    verify(emitter.emit()).never();
  });
});
