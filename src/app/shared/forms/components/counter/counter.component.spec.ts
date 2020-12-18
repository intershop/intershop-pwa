import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { spy, verify } from 'ts-mockito';

import { CounterComponent } from './counter.component';

describe('Counter Component', () => {
  let component: CounterComponent;
  let fixture: ComponentFixture<CounterComponent>;
  let element: HTMLElement;

  const controlName = 'quantity';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [CounterComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CounterComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    component.form = new FormGroup({
      [controlName]: new FormControl(),
    });
    component.controlName = controlName;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  describe('with value', () => {
    beforeEach(() => {
      component.form.get(controlName).setValue(42);
      fixture.detectChanges();
    });

    it('should display value from form when rendered', () => {
      const display = element.querySelector(`[data-testing-id=${controlName}]`);
      expect(display.textContent).toMatchInlineSnapshot(`""`);
    });

    it('should increase value when increase button was clicked', () => {
      const componentSpy = spy(component);
      fixture.debugElement.query(By.css(`[data-testing-id=increase-${controlName}]`)).triggerEventHandler('click', {});
      fixture.detectChanges();
      verify(componentSpy.increase()).once();

      const display = element.querySelector(`[data-testing-id=${controlName}]`);
      expect(display.textContent).toMatchInlineSnapshot(`"43"`);
    });

    it('should decrease value when decrease button was clicked', () => {
      const componentSpy = spy(component);
      fixture.debugElement.query(By.css(`[data-testing-id=decrease-${controlName}]`)).triggerEventHandler('click', {});
      fixture.detectChanges();
      verify(componentSpy.decrease()).once();

      const display = element.querySelector(`[data-testing-id=${controlName}]`);
      expect(display.textContent).toMatchInlineSnapshot(`"41"`);
    });

    describe('with max', () => {
      beforeEach(() => {
        component.max = 42;
        component.ngOnChanges();
        fixture.detectChanges();
      });

      it('should disable increase button when max is reached', () => {
        const increase = element.querySelector(`[data-testing-id=increase-${controlName}]`);
        expect(increase.hasAttribute('disabled')).toBeTrue();
      });
    });

    describe('with min', () => {
      beforeEach(() => {
        component.min = 42;
        component.ngOnChanges();
        fixture.detectChanges();
      });

      it('should disable decrease button when min is reached', () => {
        const decrease = element.querySelector(`[data-testing-id=decrease-${controlName}]`);
        expect(decrease.hasAttribute('disabled')).toBeTrue();
      });
    });
  });
});
