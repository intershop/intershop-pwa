import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { anything, capture, instance, mock, spy, verify, when } from 'ts-mockito';

import { FormlyTestingModule } from 'ish-shared/formly/dev/testing/formly-testing.module';

import { OrderTemplatesFacade } from '../../facades/order-templates.facade';
import { SelectOrderTemplateFormComponent } from '../select-order-template-form/select-order-template-form.component';

import { SelectOrderTemplateModalComponent } from './select-order-template-modal.component';

describe('Select Order Template Modal Component', () => {
  let component: SelectOrderTemplateModalComponent;
  let fixture: ComponentFixture<SelectOrderTemplateModalComponent>;
  let element: HTMLElement;
  let orderTemplateFacadeMock: OrderTemplatesFacade;
  const orderTemplateDetails = {
    title: 'testing order template',
    id: '.SKsEQAE4FIAAAFuNiUBWx0d',
    itemsCount: 0,
    public: false,
  };

  /**
   * A fixture.detectChanges() is necessary to make sure the newOrderTemplate
   * formControl is not disabled from its expressionProperty
   */
  function updateOrderTemplateAndNew(newOrderTemplate: string = 'New Ordertemplate Title') {
    component.formGroup.patchValue({ orderTemplate: 'new' });
    fixture.detectChanges();
    component.formGroup.patchValue({ newOrderTemplate });
  }

  /**
   * emulates a realistic startup scenario:
   * the component is initialized before the show() function is called and
   * real functionality begins
   */
  function startup() {
    fixture.detectChanges();
    component.show();
    fixture.detectChanges();
  }

  beforeEach(async () => {
    orderTemplateFacadeMock = mock(OrderTemplatesFacade);

    await TestBed.configureTestingModule({
      declarations: [SelectOrderTemplateFormComponent, SelectOrderTemplateModalComponent],
      imports: [FormlyTestingModule, TranslateModule.forRoot()],
      providers: [{ provide: OrderTemplatesFacade, useFactory: () => instance(orderTemplateFacadeMock) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectOrderTemplateModalComponent);

    component = fixture.componentInstance;
    element = fixture.nativeElement;
    when(orderTemplateFacadeMock.currentOrderTemplate$).thenReturn(of(orderTemplateDetails));
    when(orderTemplateFacadeMock.orderTemplatesSelectOptions$(anything())).thenReturn(
      of([{ value: orderTemplateDetails.id, label: orderTemplateDetails.title }])
    );
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should emit correct object on form submit with known order template', fakeAsync(() => {
    startup();

    const emitter = spy(component.submitEmitter);
    component.formGroup.patchValue({ orderTemplate: orderTemplateDetails.id });

    component.submitForm();
    tick(1000);
    verify(emitter.emit(anything())).once();
    const [arg] = capture(emitter.emit).last();
    expect(arg).toMatchInlineSnapshot(`
Object {
  "id": ".SKsEQAE4FIAAAFuNiUBWx0d",
  "title": "testing order template",
}
`);
  }));

  it('should emit correct object on form submit with new ordertemplate', fakeAsync(() => {
    startup();

    const emitter = spy(component.submitEmitter);
    updateOrderTemplateAndNew();

    component.submitForm();
    tick(1000);
    verify(emitter.emit(anything())).once();
    const [arg] = capture(emitter.emit).last();
    expect(arg).toMatchInlineSnapshot(`
Object {
  "id": undefined,
  "title": "New Ordertemplate Title",
}
`);
  }));

  it('should emit correct object on single field form submit with new orderTemplate', fakeAsync(() => {
    when(orderTemplateFacadeMock.orderTemplatesSelectOptions$(anything())).thenReturn(of([]));
    startup();

    const emitter = spy(component.submitEmitter);
    component.formGroup.patchValue({ newOrderTemplate: 'New Ordertemplate Title' });

    component.submitForm();
    tick(1000);
    verify(emitter.emit(anything())).once();
    const [arg] = capture(emitter.emit).last();
    expect(arg).toMatchInlineSnapshot(`
Object {
  "id": undefined,
  "title": "New Ordertemplate Title",
}
`);
  }));

  it('should not emit on radio button form submit with no new orderTemplate name', () => {
    startup();

    const emitter = spy(component.submitEmitter);
    updateOrderTemplateAndNew('');

    component.submitForm();
    verify(emitter.emit(anything())).never();
  });

  it('should not emit on single field form submit with no orderTemplate name', fakeAsync(() => {
    when(orderTemplateFacadeMock.orderTemplatesSelectOptions$(anything())).thenReturn(of([]));
    startup();

    const emitter = spy(component.submitEmitter);
    component.formGroup.patchValue({ newOrderTemplate: '' });

    component.submitForm();
    tick(100);
    verify(emitter.emit(anything())).never();
  }));

  it('should switch modal contents after successful submit', fakeAsync(() => {
    startup();

    component.formGroup.patchValue({ orderTemplate: orderTemplateDetails.id });

    component.submitForm();
    tick(1000);
    expect(element.querySelector('form')).toBeFalsy();
  }));

  describe('selectedOrderTemplateTitle$', () => {
    it('should return correct title of known order template', done => {
      startup();
      component.formGroup.patchValue({ orderTemplate: orderTemplateDetails.id });
      component.selectedOrderTemplateTitle$.subscribe(t => {
        expect(t).toBe('testing order template');
        done();
      });
    });

    it('should return correct title of new order template', done => {
      startup();
      updateOrderTemplateAndNew();

      component.selectedOrderTemplateTitle$.subscribe(t => {
        expect(t).toBe('New Ordertemplate Title');
        done();
      });
    });
  });

  describe('selectedOrderTemplateRoute$', () => {
    it('should return correct route of known order template', done => {
      startup();
      component.formGroup.patchValue({ orderTemplate: orderTemplateDetails.id });

      component.selectedOrderTemplateRoute$.subscribe(r => {
        expect(r).toBe('route://account/order-templates/.SKsEQAE4FIAAAFuNiUBWx0d');
        done();
      });
    });

    it('should return correct route of new order template', done => {
      startup();
      updateOrderTemplateAndNew();

      component.selectedOrderTemplateRoute$.subscribe(r => {
        expect(r).toBe('route://account/order-templates/.SKsEQAE4FIAAAFuNiUBWx0d');
      });
      done();
    });
  });
});
