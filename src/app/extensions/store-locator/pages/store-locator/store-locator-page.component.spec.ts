import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { MockComponent, MockDirective } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { FeatureToggleDirective } from 'ish-core/directives/feature-toggle.directive';
import { NotFeatureToggleDirective } from 'ish-core/directives/not-feature-toggle.directive';
import { ScrollDirective } from 'ish-core/directives/scroll.directive';
import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { AppFacade } from 'ish-core/facades/app.facade';
import { ErrorMessageComponent } from 'ish-shared/components/common/error-message/error-message.component';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';
import { SkipContentLinkComponent } from 'ish-shared/components/common/skip-content-link/skip-content-link.component';
import { FormlyTestingModule } from 'ish-shared/formly/dev/testing/formly-testing.module';

import { StoreLocatorFacade } from '../../facades/store-locator.facade';
import { StoreAddressComponent } from '../../shared/store-address/store-address.component';
import { StoresMapComponent } from '../../shared/stores-map/stores-map.component';

import { StoreLocatorPageComponent } from './store-locator-page.component';

describe('Store Locator Page Component', () => {
  let component: StoreLocatorPageComponent;
  let fixture: ComponentFixture<StoreLocatorPageComponent>;
  let element: HTMLElement;
  const storeLocatorFacade = mock(StoreLocatorFacade);
  const appFacade = mock(AppFacade);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormlyTestingModule, StoreLocatorPageComponent],
      providers: [
        { provide: AppFacade, useFactory: () => instance(appFacade) },
        { provide: StoreLocatorFacade, useFactory: () => instance(storeLocatorFacade) },
        provideTranslateService(),
      ],
    })
      .overrideComponent(StoreLocatorPageComponent, {
        remove: {
          imports: [
            ErrorMessageComponent,
            FeatureToggleDirective,
            LoadingComponent,
            NotFeatureToggleDirective,
            ScrollDirective,
            ServerHtmlDirective,
            SkipContentLinkComponent,
            StoreAddressComponent,
            StoresMapComponent,
          ],
        },
        add: {
          imports: [
            MockComponent(ErrorMessageComponent),
            MockDirective(FeatureToggleDirective),
            MockComponent(LoadingComponent),
            MockDirective(NotFeatureToggleDirective),
            MockDirective(ScrollDirective),
            MockDirective(ServerHtmlDirective),
            MockComponent(SkipContentLinkComponent),
            MockComponent(StoreAddressComponent),
            MockComponent(StoresMapComponent),
          ],
        },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreLocatorPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    when(appFacade.countries$()).thenReturn(of([]));
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
