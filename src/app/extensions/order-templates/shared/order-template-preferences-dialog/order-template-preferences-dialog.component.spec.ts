import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { anything, capture, spy, verify } from 'ts-mockito';

import { FormlyTestingModule } from 'ish-shared/formly/dev/testing/formly-testing.module';

import { OrderTemplatePreferencesDialogComponent } from './order-template-preferences-dialog.component';

describe('Order Template Preferences Dialog Component', () => {
  let component: OrderTemplatePreferencesDialogComponent;
  let fixture: ComponentFixture<OrderTemplatePreferencesDialogComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrderTemplatePreferencesDialogComponent],
      imports: [FormlyTestingModule, TranslateModule.forRoot()],
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
    fixture.detectChanges();
    component.model = {
      title: 'test order template',
    };

    const emitter = spy(component.submit);

    component.submitOrderTemplateForm();

    verify(emitter.emit(anything())).once();
    const [arg] = capture(emitter.emit).last();
    expect(arg).toMatchInlineSnapshot(`
      Object {
        "id": "test order template",
        "title": "test order template",
      }
    `);
  });

  it('should not emit new order template data when submit form was called and the form was invalid', () => {
    fixture.detectChanges();
    const emitter = spy(component.submit);
    component.submitOrderTemplateForm();

    verify(emitter.emit()).never();
  });
});
