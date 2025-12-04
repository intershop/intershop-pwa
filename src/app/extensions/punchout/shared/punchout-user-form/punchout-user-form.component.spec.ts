import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { provideRouter } from '@angular/router';
import { FormlyForm } from '@ngx-formly/core';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { PunchoutUserFormComponent } from './punchout-user-form.component';

describe('Punchout User Form Component', () => {
  let component: PunchoutUserFormComponent;
  let fixture: ComponentFixture<PunchoutUserFormComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PunchoutUserFormComponent, ReactiveFormsModule, TranslateModule.forRoot()],
      providers: [provideRouter([])],
    })
      .overrideComponent(PunchoutUserFormComponent, {
        remove: { imports: [FormlyForm] },
        add: { imports: [MockComponent(FormlyForm)] },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PunchoutUserFormComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.punchoutType = 'oci';
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
