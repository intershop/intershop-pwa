import { ComponentFixture, TestBed } from '@angular/core/testing';
import { anything, capture, spy, verify } from 'ts-mockito';

import { SwitchComponent } from './switch.component';

describe('Switch Component', () => {
  let component: SwitchComponent;
  let fixture: ComponentFixture<SwitchComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({}).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SwitchComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should initialize with default values', () => {
    fixture.detectChanges();
    expect(component.active).toBeFalse();
    expect(component.labelActive).toBeEmpty();
    expect(component.labelInactive).toBeEmpty();
    expect(component.disabled).toBeFalse();
    expect(component.ariaLabel).toBeEmpty();
  });

  it('should set aria-label attribute when ariaLabel is set', () => {
    component.active = false;
    component.ariaLabel = 'test aria label';
    fixture.detectChanges();

    expect(element.getElementsByClassName('custom-control-input')[0].getAttribute('aria-label')).toBe(
      'test aria label'
    );
  });

  it('should display correct label when active', () => {
    component.labelInactive = 'test label inactive';
    component.labelActive = 'test label active';
    component.active = true;
    component.ngOnChanges();
    fixture.detectChanges();

    expect(element.querySelector('[data-testing-id="customControlLabel"]').innerHTML).toContain('test label active');
  });

  it('should display correct label when set to inactive', () => {
    component.labelInactive = 'test label inactive';
    component.labelActive = 'test label active';
    component.active = false;
    component.ngOnChanges();
    fixture.detectChanges();

    expect(element.querySelector('[data-testing-id="customControlLabel"]').innerHTML).toContain('test label inactive');
  });

  it('should update activeState when active input changes', () => {
    component.active = false;
    component.ngOnChanges();
    expect(component.activeState).toBeFalse();

    component.active = true;
    component.ngOnChanges();
    expect(component.activeState).toBeTrue();
  });

  it('should toggle state when toggleState is called', () => {
    component.active = false;
    fixture.detectChanges();
    component.toggleState();
    expect(component.activeState).toBeTrue();
    component.toggleState();
    expect(component.activeState).toBeFalse();
  });

  it('should emit toggleSwitch event with correct values', () => {
    const emitter = spy(component.toggleSwitch);
    fixture.detectChanges();
    component.active = false;

    component.toggleState();

    verify(emitter.emit(anything())).once();
    const [arg] = capture(emitter.emit).last();
    expect(arg).toEqual({ active: true, id: component.id });

    component.toggleState();
    expect(arg).toEqual({ active: true, id: component.id });
  });
});
