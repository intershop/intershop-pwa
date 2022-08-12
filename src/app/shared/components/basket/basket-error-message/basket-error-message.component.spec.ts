import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpError } from 'ish-core/models/http-error/http-error.model';

import { BasketErrorMessageComponent } from './basket-error-message.component';

describe('Basket Error Message Component', () => {
  let component: BasketErrorMessageComponent;
  let fixture: ComponentFixture<BasketErrorMessageComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BasketErrorMessageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BasketErrorMessageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    component.error = {
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
  });
});
