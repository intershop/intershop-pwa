import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap';
import { FormlyModule } from '@ngx-formly/core';
import { TranslatePipe, provideTranslateService } from '@ngx-translate/core';
import { MockDirective } from 'ng-mocks';

import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { FormlyTestingComponentsModule } from 'ish-shared/formly/dev/testing/formly-testing-components.module';
import { FormlyTestingContainerComponent } from 'ish-shared/formly/dev/testing/formly-testing-container/formly-testing-container.component';
import { FormlyTestingExampleComponent } from 'ish-shared/formly/dev/testing/formly-testing-example/formly-testing-example.component';

import { CxmlHelpTextWrapperComponent } from './cxml-help-text-wrapper.component';

const fieldBase = {
  key: 'example',
  type: 'example',
  wrappers: ['description'],
  props: { helpText: 'test' },
};

describe('Cxml Help Text Wrapper Component', () => {
  let component: FormlyTestingContainerComponent;
  let fixture: ComponentFixture<FormlyTestingContainerComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormlyModule.forRoot({
          types: [{ name: 'example', component: FormlyTestingExampleComponent }],
          wrappers: [{ name: 'description', component: CxmlHelpTextWrapperComponent }],
        }),
        FormlyTestingComponentsModule,
        TranslatePipe,
      ],
      declarations: [CxmlHelpTextWrapperComponent, MockDirective(NgbCollapse), MockDirective(ServerHtmlDirective)],
      providers: [provideTranslateService()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormlyTestingContainerComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    component.form = new FormGroup({});
    component.model = {};
    component.fields = [fieldBase];
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
    expect(element.querySelector('ish-cxml-help-text-wrapper')).toBeTruthy();
  });

  it('should render the help text link', () => {
    fixture.detectChanges();
    expect(element.querySelector('.btn-link')).toBeTruthy();
  });
});
