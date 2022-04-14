import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserTransferStateModule } from '@angular/platform-browser';
import { MockComponent } from 'ng-mocks';

import { RoleToggleModule } from 'ish-core/role-toggle.module';
import { FooterTopComponent } from 'ish-shell/footer/footer-top/footer-top.component';

import { FooterComponent } from './footer.component';

describe('Footer Component', () => {
  let fixture: ComponentFixture<FooterComponent>;
  let element: HTMLElement;
  let component: FooterComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrowserTransferStateModule, RoleToggleModule.forTesting()],
      declarations: [FooterComponent, MockComponent(FooterTopComponent)],
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
