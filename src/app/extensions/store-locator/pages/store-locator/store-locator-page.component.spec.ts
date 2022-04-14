import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { AppFacade } from 'ish-core/facades/app.facade';
import { ErrorMessageComponent } from 'ish-shared/components/common/error-message/error-message.component';
import { FormlyTestingModule } from 'ish-shared/formly/dev/testing/formly-testing.module';

import { StoreLocatorFacade } from '../../facades/store-locator.facade';

import { StoreLocatorPageComponent } from './store-locator-page.component';

describe('Store Locator Page Component', () => {
  let component: StoreLocatorPageComponent;
  let fixture: ComponentFixture<StoreLocatorPageComponent>;
  let element: HTMLElement;
  const storeLocatorFacade = mock(StoreLocatorFacade);
  const appFacade = mock(AppFacade);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormlyTestingModule, TranslateModule.forRoot()],
      declarations: [MockComponent(ErrorMessageComponent), StoreLocatorPageComponent],
      providers: [
        { provide: AppFacade, useFactory: () => instance(appFacade) },
        { provide: StoreLocatorFacade, useFactory: () => instance(storeLocatorFacade) },
      ],
    }).compileComponents();
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
