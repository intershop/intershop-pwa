import { Component, Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { ComponentFixture, DeferBlockBehavior, TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';

import { FormlyTestingComponentsModule } from 'ish-shared/formly/dev/testing/formly-testing-components.module';
import { FormlyTestingContainerComponent } from 'ish-shared/formly/dev/testing/formly-testing-container/formly-testing-container.component';

import { AccountOrderSelectBuyerFieldComponent } from './account-order-select-buyer-field.component';

@Directive({
  selector: '[ishIsAuthorizedTo]',
  standalone: true,
})
class MockAuthorizationToggleDirective {
  @Input() set ishIsAuthorizedTo(permission: unknown) {
    void permission;
    this.viewContainerRef.clear();
    this.viewContainerRef.createEmbeddedView(this.templateRef);
  }

  constructor(
    private templateRef: TemplateRef<unknown>,
    private viewContainerRef: ViewContainerRef
  ) {}
}

@Component({
  selector: 'ish-buyers-select',
  template: '',
  standalone: true,
})
class MockBuyersSelectComponent {
  @Input() control: unknown;
  @Input() field: unknown;
}

describe('Account Order Select Buyer Field Component', () => {
  let component: FormlyTestingContainerComponent;
  let fixture: ComponentFixture<FormlyTestingContainerComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AccountOrderSelectBuyerFieldComponent,
        FormlyModule.forRoot({
          types: [{ name: 'select-buyer', component: AccountOrderSelectBuyerFieldComponent }],
        }),
        FormlyTestingComponentsModule,
      ],
      deferBlockBehavior: DeferBlockBehavior.Playthrough,
    })
      .overrideComponent(AccountOrderSelectBuyerFieldComponent, {
        set: {
          imports: [MockAuthorizationToggleDirective, MockBuyersSelectComponent],
        },
      })
      .compileComponents();
  });

  beforeEach(() => {
    const testComponentInputs = {
      model: {},
      form: new FormGroup({}),
      fields: [
        {
          key: 'select-buyer',
          type: 'select-buyer',
        },
      ],
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
    expect(element.querySelector('ish-account-order-select-buyer-field')).toBeTruthy();
  });

  it('should render a select box after creation', async () => {
    fixture.detectChanges();
    await fixture.whenRenderingDone();
    fixture.detectChanges();
    expect(element.querySelector('[data-testing-id=buyers-select]')).toBeTruthy();
  });
});
