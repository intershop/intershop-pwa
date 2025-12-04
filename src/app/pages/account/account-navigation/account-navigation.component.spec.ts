import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockDirective, MockPipe } from 'ng-mocks';

import { AuthorizationToggleDirective } from 'ish-core/directives/authorization-toggle.directive';
import { NotRoleToggleDirective } from 'ish-core/directives/not-role-toggle.directive';
import { FeatureTogglePipe } from 'ish-core/pipes/feature-toggle.pipe';
import { ServerSettingPipe } from 'ish-core/pipes/server-setting.pipe';

import { AccountUserInfoComponent } from '../account-user-info/account-user-info.component';

import { AccountNavigationComponent } from './account-navigation.component';

@Directive({
  selector: '[ishIsAuthorizedTo]',
  standalone: true,
})
class MockAuthorizationToggleDirective {
  @Input() set ishIsAuthorizedTo(permission: unknown) {
    void permission;
    this.viewContainerRef.clear();
    this.viewContainerRef.createEmbeddedView(this.templateRef);
  }

  constructor(
    private templateRef: TemplateRef<unknown>,
    private viewContainerRef: ViewContainerRef
  ) {}
}

@Directive({
  selector: '[ishHasNotRole]',
  standalone: true,
})
class MockNotRoleToggleDirective {
  @Input() set ishHasNotRole(role: unknown) {
    void role;
    this.viewContainerRef.clear();
    this.viewContainerRef.createEmbeddedView(this.templateRef);
  }

  constructor(
    private templateRef: TemplateRef<unknown>,
    private viewContainerRef: ViewContainerRef
  ) {}
}

describe('Account Navigation Component', () => {
  let component: AccountNavigationComponent;
  let fixture: ComponentFixture<AccountNavigationComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountNavigationComponent, TranslateModule.forRoot()],
      providers: [provideRouter([])],
    })
      .overrideComponent(AccountNavigationComponent, {
        remove: {
          imports: [
            AccountUserInfoComponent,
            AuthorizationToggleDirective,
            FeatureTogglePipe,
            NgbCollapse,
            NotRoleToggleDirective,
            ServerSettingPipe,
          ],
        },
        add: {
          imports: [
            MockComponent(AccountUserInfoComponent),
            MockAuthorizationToggleDirective,
            MockDirective(NgbCollapse),
            MockNotRoleToggleDirective,
            MockPipe(FeatureTogglePipe, () => true),
            MockPipe(ServerSettingPipe, () => true),
          ],
        },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountNavigationComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  const expandNavigationGroup = (id: string) => {
    component.navItems.find(item => item.id === id).isCollapsed = false;
  };

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display link to quote list', () => {
    fixture.detectChanges();
    expect(element.textContent).toContain('account.navigation.quotes.link');
  });

  it('should display link to order templates list', () => {
    fixture.detectChanges();
    expect(element.textContent).toContain('account.ordertemplates.link');
  });

  it('should display link to user list', () => {
    expandNavigationGroup('my-organization');
    fixture.detectChanges();
    fixture.detectChanges();
    expect(element.textContent).toContain('account.organization.user_management');
  });

  it('should display link to requisition list if order approval service is enabled', () => {
    expandNavigationGroup('my-purchases');
    fixture.detectChanges();
    fixture.detectChanges();
    expect(element.textContent).toContain('account.requisitions.requisitions');
  });
});
