import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockDirective } from 'ng-mocks';

import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { CheckboxComponent } from 'ish-shared/forms/components/checkbox/checkbox.component';

import { TacCheckboxComponent } from './tac-checkbox.component';

describe('Tac Checkbox Component', () => {
  let component: TacCheckboxComponent;
  let fixture: ComponentFixture<TacCheckboxComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [MockComponent(CheckboxComponent), MockDirective(ServerHtmlDirective), TacCheckboxComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TacCheckboxComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
