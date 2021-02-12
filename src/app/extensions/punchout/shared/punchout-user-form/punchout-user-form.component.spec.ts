import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyConfig, FormlyForm } from '@ngx-formly/core';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { anything, instance, mock, when } from 'ts-mockito';

import { PunchoutUserFormComponent } from './punchout-user-form.component';

describe('Punchout User Form Component', () => {
  let component: PunchoutUserFormComponent;
  let fixture: ComponentFixture<PunchoutUserFormComponent>;
  let element: HTMLElement;
  let formlyConfig: FormlyConfig;

  beforeEach(async () => {
    formlyConfig = mock(FormlyConfig);
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, TranslateModule.forRoot()],
      declarations: [MockComponent(FormlyForm), PunchoutUserFormComponent],
      providers: [{ provide: FormlyConfig, useFactory: () => instance(formlyConfig) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PunchoutUserFormComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.punchoutType = 'oci';

    when(formlyConfig.getType(anything())).thenReturn({ name: '', wrappers: [] });
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
