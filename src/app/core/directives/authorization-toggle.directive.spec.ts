import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorizationToggleModule } from 'ish-core/authorization-toggle.module';

@Component({
  template: `
    <div>unrelated</div>
    <div *ishIsAuthorizedTo="'DO_THIS'">content1</div>
    <div *ishIsAuthorizedTo="'DO_THAT'">content2</div>
    <div *ishIsAuthorizedTo="dynamicPermission">content3</div>
  `,
  // Default change detection for dynamic permission test
  changeDetection: ChangeDetectionStrategy.Default,
})
class TestComponent {
  dynamicPermission: string;
}

describe('Authorization Toggle Directive', () => {
  let fixture: ComponentFixture<TestComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [AuthorizationToggleModule.forTesting('DO_THIS')],
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

  it('should render content if permission is granted', () => {
    expect(element.textContent).toContain('content1');
  });

  it('should not render content if not permitted', () => {
    expect(element.textContent).not.toContain('content2');
  });

  it('should react on changing permissions in store', () => {
    expect(element.textContent).not.toContain('content2');

    AuthorizationToggleModule.switchTestingPermissions('DO_THAT');
    fixture.detectChanges();

    expect(element.textContent).not.toContain('content1');
    expect(element.textContent).toContain('content2');

    AuthorizationToggleModule.switchTestingPermissions('DO_THIS');
    fixture.detectChanges();

    expect(element.textContent).toContain('content1');
    expect(element.textContent).not.toContain('content2');
  });

  it('should react on changing permissions from input', () => {
    expect(element.textContent).not.toContain('content3');

    fixture.componentInstance.dynamicPermission = 'DO_THIS';
    fixture.detectChanges();

    expect(element.textContent).toContain('content3');

    fixture.componentInstance.dynamicPermission = 'DO_THAT';
    fixture.detectChanges();

    expect(element.textContent).not.toContain('content3');
  });
});
