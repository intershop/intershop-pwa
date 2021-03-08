import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleToggleModule } from 'ish-core/role-toggle.module';

@Component({
  template: `
    <div>unrelated</div>
    <div *ishHasNotRole="'ROLE1'">content1</div>
    <div *ishHasNotRole="'ROLE2'">content2</div>
    <div *ishHasNotRole="dynamicRole">content3</div>
    <div *ishHasNotRole="['ROLE1', 'ROLE3']">content4</div>
    <div *ishHasNotRole="['ROLE2', 'ROLE3']">content5</div>
  `,
  // Default change detection for dynamic role test
  changeDetection: ChangeDetectionStrategy.Default,
})
class TestComponent {
  dynamicRole: string;
}

describe('Not Role Toggle Directive', () => {
  let fixture: ComponentFixture<TestComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [RoleToggleModule.forTesting('ROLE1')],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should always render unrelated content', () => {
    expect(element.textContent).toContain('unrelated');
  });

  it('should not render content if role is given', () => {
    expect(element.textContent).not.toContain('content1');
  });

  it('should render content if the role is not given', () => {
    expect(element.textContent).toContain('content2');
  });

  it('should react on changing roles in store', () => {
    RoleToggleModule.switchTestingRoles('ROLE2');
    fixture.detectChanges();

    expect(element.textContent).toContain('content1');
    expect(element.textContent).not.toContain('content2');

    RoleToggleModule.switchTestingRoles('ROLE1');
    fixture.detectChanges();

    expect(element.textContent).not.toContain('content1');
    expect(element.textContent).toContain('content2');
  });

  it('should react on changing roles from input', () => {
    expect(element.textContent).toContain('content3');

    fixture.componentInstance.dynamicRole = 'ROLE1';
    fixture.detectChanges();

    expect(element.textContent).not.toContain('content3');

    fixture.componentInstance.dynamicRole = 'ROLE2';
    fixture.detectChanges();

    expect(element.textContent).toContain('content3');
  });

  it('should not render content if role is in given roles', () => {
    expect(element.textContent).not.toContain('content4');
  });

  it('should render content if the role is not in given roles', () => {
    expect(element.textContent).toContain('content5');
  });
});
