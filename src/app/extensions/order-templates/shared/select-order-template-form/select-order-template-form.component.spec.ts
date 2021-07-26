import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { anything, instance, mock, when } from 'ts-mockito';

import { FormlyTestingModule } from 'ish-shared/formly/dev/testing/formly-testing.module';

import { OrderTemplatesFacade } from '../../facades/order-templates.facade';

import { SelectOrderTemplateFormComponent } from './select-order-template-form.component';

describe('Select Order Template Form Component', () => {
  let component: SelectOrderTemplateFormComponent;
  let fixture: ComponentFixture<SelectOrderTemplateFormComponent>;
  let element: HTMLElement;
  let orderTemplatesFacade: OrderTemplatesFacade;

  const orderTemplateDetails = {
    title: 'testing order template',
    id: '.SKsEQAE4FIAAAFuNiUBWx0d',
    itemsCount: 0,
    public: false,
  };

  beforeEach(async () => {
    orderTemplatesFacade = mock(OrderTemplatesFacade);
    await TestBed.configureTestingModule({
      declarations: [SelectOrderTemplateFormComponent],
      imports: [FormlyTestingModule, TranslateModule.forRoot()],
      providers: [{ provide: OrderTemplatesFacade, useFactory: () => instance(orderTemplatesFacade) }],
    }).compileComponents();
  });

  beforeEach(() => {
    when(orderTemplatesFacade.orderTemplatesSelectOptions$(anything())).thenReturn(
      of([{ value: orderTemplateDetails.id, label: orderTemplateDetails.title }])
    );
    fixture = TestBed.createComponent(SelectOrderTemplateFormComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
