import { NO_ERRORS_SCHEMA } from '@angular/core/';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { FormsSharedModule } from '../../../../forms-shared.module';
import { InputBirthdayComponent } from './input-birthday.component';

describe('Input Birthday Component', () => {
  let component: InputBirthdayComponent;
  let fixture: ComponentFixture<InputBirthdayComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsSharedModule],
      providers: [{ provide: TranslateService }],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(InputBirthdayComponent);
        component = fixture.componentInstance;
        element = fixture.nativeElement;

        const form = new FormGroup({
          birthday: new FormControl(),
        });
        component.form = form;
      });
  }));

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
