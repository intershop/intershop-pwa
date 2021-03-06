import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockDirective } from 'ng-mocks';
import { of } from 'rxjs';
import { anything, capture, instance, mock, spy, verify, when } from 'ts-mockito';

import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { InputComponent } from 'ish-shared/forms/components/input/input.component';

import { OrderTemplatesFacade } from '../../facades/order-templates.facade';

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

  beforeEach(async () => {
    orderTemplateFacadeMock = mock(OrderTemplatesFacade);

    await TestBed.configureTestingModule({
      declarations: [
        MockComponent(InputComponent),
        MockDirective(ServerHtmlDirective),
        SelectOrderTemplateModalComponent,
      ],
      imports: [NgbModalModule, ReactiveFormsModule, TranslateModule.forRoot()],
      providers: [{ provide: OrderTemplatesFacade, useFactory: () => instance(orderTemplateFacadeMock) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectOrderTemplateModalComponent);

    component = fixture.componentInstance;
    element = fixture.nativeElement;
    when(orderTemplateFacadeMock.currentOrderTemplate$).thenReturn(of(orderTemplateDetails));
    when(orderTemplateFacadeMock.orderTemplates$).thenReturn(of([orderTemplateDetails]));

    fixture.detectChanges();
    component.show();

    component.orderTemplateOptions = [{ value: 'orderTemplate', label: 'Order Template' }];
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should emit correct object on form submit with known order template', () => {
    const emitter = spy(component.submitEmitter);
    component.updateOrderTemplateForm.patchValue({ orderTemplate: 'orderTemplate' });

    component.submitForm();
    verify(emitter.emit(anything())).once();
    const [arg] = capture(emitter.emit).last();
    expect(arg).toEqual({
      id: 'orderTemplate',
      title: 'Order Template',
    });
  });

  it('should emit correct object on form submit with new ordertemplate', () => {
    const emitter = spy(component.submitEmitter);
    component.updateOrderTemplateForm.patchValue({
      orderTemplate: 'newTemplate',
      newOrderTemplate: 'New Order Template Title',
    });

    component.submitForm();
    verify(emitter.emit(anything())).once();
    const [arg] = capture(emitter.emit).last();
    expect(arg).toEqual({
      id: undefined,
      title: 'New Order Template Title',
    });
  });

  it('should switch modal contents after successful submit', () => {
    component.updateOrderTemplateForm.patchValue({ orderTemplate: 'orderTemplate' });

    component.submitForm();
    expect(element.querySelector('form')).toBeFalsy();
  });

  it('should ensure that newOrderTemplate remove Validator after being deselected', () => {
    component.updateOrderTemplateForm.patchValue({ orderTemplate: 'orderTemplate', newOrderTemplate: '' });
    expect(component.updateOrderTemplateForm.get('newOrderTemplate').validator).toBeNull();
  });

  describe('selectedOrderTemplateTitle', () => {
    it('should return correct title of known order template', () => {
      component.updateOrderTemplateForm.patchValue({ orderTemplate: 'orderTemplate' });
      const title = component.selectedOrderTemplateTitle;
      expect(title).toBe('Order Template');
    });

    it('should return correct title of new order template', () => {
      component.updateOrderTemplateForm.patchValue({
        orderTemplate: 'newTemplate',
        newOrderTemplate: 'New Order Template Title',
      });
      const title = component.selectedOrderTemplateTitle;
      expect(title).toBe('New Order Template Title');
    });
  });

  describe('selectedOrderTemplateRoute', () => {
    it('should return correct route of known order template', () => {
      component.updateOrderTemplateForm.patchValue({ orderTemplate: 'orderTemplate' });
      const route = component.selectedOrderTemplateRoute;
      expect(route).toBe('route://account/order-templates/orderTemplate');
    });

    it('should return correct route of new order template', () => {
      component.updateOrderTemplateForm.patchValue({
        orderTemplate: 'newTemplate',
        newOrderTemplate: 'New Order Template Title',
      });
      component.idAfterCreate = 'idAfterCreate';
      const route = component.selectedOrderTemplateRoute;
      expect(route).toBe('route://account/order-templates/idAfterCreate');
    });
  });
});
