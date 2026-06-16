import { ComponentFixture, TestBed } from '@angular/core/testing';

import { formlyTestingImports } from 'ish-shared/formly/dev/testing/formly-testing.imports';

import { FormlyTestingContainerComponent } from './formly-testing-container.component';

describe('Formly Testing Container Component', () => {
  let component: FormlyTestingContainerComponent;
  let fixture: ComponentFixture<FormlyTestingContainerComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [...formlyTestingImports],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormlyTestingContainerComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
