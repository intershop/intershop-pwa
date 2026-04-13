import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockDirective, MockPipe } from 'ng-mocks';

import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { FeatureTogglePipe } from 'ish-core/pipes/feature-toggle.pipe';
import { RoleToggleModule } from 'ish-core/role-toggle';
import { ContentIncludeComponent } from 'ish-shared/cms/components/content-include/content-include.component';

import { CopilotComponent } from '../../../extensions/copilot/shared/copilot/copilot.component';
import { StoreLocatorFooterComponent } from '../../../extensions/store-locator/shared/store-locator-footer/store-locator-footer.component';
import { FooterComponent } from './footer.component';

describe('Footer Component', () => {
  let fixture: ComponentFixture<FooterComponent>;
  let element: HTMLElement;
  let component: FooterComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterComponent, TranslateModule.forRoot()],
      providers: [...(RoleToggleModule.forTesting().providers ?? [])],
    })
      .overrideComponent(FooterComponent, {
        remove: {
          imports: [
            ContentIncludeComponent,
            CopilotComponent,
            FeatureTogglePipe,
            ServerHtmlDirective,
            StoreLocatorFooterComponent,
          ],
        },
        add: {
          imports: [
            MockComponent(ContentIncludeComponent),
            MockComponent(CopilotComponent),
            MockPipe(FeatureTogglePipe, () => false),
            MockDirective(ServerHtmlDirective),
            MockComponent(StoreLocatorFooterComponent),
          ],
        },
      })
      .compileComponents();
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
