import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { ErrorMessageComponent } from 'ish-shared/components/common/error-message/error-message.component';

import { BasketErrorMessageComponent } from './basket-error-message.component';

describe('Basket Error Message Component', () => {
  let component: BasketErrorMessageComponent;
  let fixture: ComponentFixture<BasketErrorMessageComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BasketErrorMessageComponent, MockComponent(ErrorMessageComponent)],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BasketErrorMessageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    component.error = {
      message: 'general_error_message',
      errors: [{ message: 'main_message', causes: [{ message: 'cause_message' }] }],
    } as HttpError;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display the error message and cause message', () => {
    fixture.detectChanges();

    expect(element.querySelector('div[data-testing-id=basket-errors]').textContent).toMatchInlineSnapshot(
      `"main_message cause_message"`
    );
    expect(element.querySelector('ish-error-message')).toBeFalsy();
  });

  it('should display a general message if the errors array is empty', () => {
    component.error = {
      message: 'general_error_message',
      errors: [],
    } as HttpError;

    fixture.detectChanges();

    expect(element.querySelector('ish-error-message')).toBeTruthy();
    expect(element.querySelector('div[data-testing-id=basket-errors]')).toBeFalsy();
  });
});
