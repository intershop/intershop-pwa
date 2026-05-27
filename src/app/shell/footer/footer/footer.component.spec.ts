import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';

import { RoleToggleModule } from 'ish-core/role-toggle.module';
import { LazyContentIncludeComponent } from 'ish-shell/shared/lazy-content-include/lazy-content-include.component';

import { FooterComponent } from './footer.component';

describe('Footer Component', () => {
  let fixture: ComponentFixture<FooterComponent>;
  let element: HTMLElement;
  let component: FooterComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoleToggleModule.forTesting()],
      declarations: [FooterComponent, MockComponent(LazyContentIncludeComponent)],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
