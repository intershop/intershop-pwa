import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { Subject, of } from 'rxjs';
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
      imports: [FormlyTestingModule, SelectOrderTemplateFormComponent],
      providers: [
        { provide: OrderTemplatesFacade, useFactory: () => instance(orderTemplatesFacade) },
        provideTranslateService(),
      ],
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

  it('should not throw before order template options are emitted', () => {
    const orderTemplateOptions$ = new Subject<{ value: string; label: string }[]>();
    when(orderTemplatesFacade.orderTemplatesSelectOptions$(anything())).thenReturn(orderTemplateOptions$);

    fixture = TestBed.createComponent(SelectOrderTemplateFormComponent);
    component = fixture.componentInstance;

    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
