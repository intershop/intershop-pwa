import { Component, Directive, EventEmitter, Input, Output } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import { FormlyField, FormlyModule } from '@ngx-formly/core';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { FormlyTestingComponentsModule } from 'ish-shared/formly/dev/testing/formly-testing-components.module';
import { FormlyTestingContainerComponent } from 'ish-shared/formly/dev/testing/formly-testing-container/formly-testing-container.component';

import { QuickorderRepeatFieldComponent } from './quickorder-repeat-field.component';

@Directive({
  selector: '[ishProductContext]',
  standalone: true,
})
class MockProductContextDirective {
  @Input() configuration: unknown;
  @Input() quantity: number;
  @Output() readonly quantityChange = new EventEmitter<number>();

  context = {
    connect: jest.fn(),
    select: jest.fn(() => of(undefined)),
  } as Partial<ProductContextFacade>;
}

@Component({
  selector: 'ish-product-quantity',
  template: '',
  standalone: true,
})
class MockProductQuantityComponent {}

describe('Quickorder Repeat Field Component', () => {
  let component: FormlyTestingContainerComponent;
  let fixture: ComponentFixture<FormlyTestingContainerComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormlyModule.forRoot({
          types: [{ name: 'repeat', component: QuickorderRepeatFieldComponent }],
        }),
        FormlyTestingComponentsModule,
        QuickorderRepeatFieldComponent,
        TranslateModule.forRoot(),
      ],
    })
      .overrideComponent(QuickorderRepeatFieldComponent, {
        set: {
          imports: [MockProductContextDirective, TranslateModule, MockProductQuantityComponent, FormlyField],
        },
      })
      .compileComponents();
  });

  beforeEach(() => {
    const testComponentInputs = {
      model: { repeat: '' },
      fields: [
        {
          key: 'repeat',
          type: 'repeat',
        },
      ],
      form: new FormGroup({}),
    };
    fixture = TestBed.createComponent(FormlyTestingContainerComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    component.testComponentInputs = testComponentInputs;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should be rendered after creation', () => {
    fixture.detectChanges();
    expect(element.querySelector('ish-quickorder-repeat-field')).toBeTruthy();
  });
});
