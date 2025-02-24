import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { anything, instance, mock, when } from 'ts-mockito';

import { AppFacade } from 'ish-core/facades/app.facade';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { ScriptLoaderService } from 'ish-core/utils/script-loader/script-loader.service';

import { CompareFacade } from '../../../compare/facades/compare.facade';
import { CopilotFacade } from '../../facades/copilot.facade';
import { CopilotConfig } from '../../models/copilot-config/copilot-config.model';

import { CopilotComponent } from './copilot.component';

const copilotConfig = {
  apiHost: 'https://api.example.com',
  chatflowid: 'xxxx-xxxx-xxxx-xxxx-xxxx',
  copilotUIFile: 'https://ui.example.com/web.js',
} as CopilotConfig;

describe('Copilot Component', () => {
  let component: CopilotComponent;
  let fixture: ComponentFixture<CopilotComponent>;
  let element: HTMLElement;
  const copilotFacade = mock(CopilotFacade);
  const appFacade = mock(AppFacade);
  const scriptLoader = mock(ScriptLoaderService);
  const translateService = mock(TranslateService);

  beforeEach(async () => {
    when(copilotFacade.copilotConfiguration$).thenReturn(of(copilotConfig));
    when(appFacade.getRestEndpointWithContext$).thenReturn(
      of('https://icm/INTERSHOP/rest/WFS/Site/-;loc=en_US;cur=USD')
    );
    when(appFacade.currentLocale$).thenReturn(of('en_US'));
    when(scriptLoader.load(anything(), anything())).thenReturn(
      of({ src: 'https://ui.example.com/web.js', loaded: true })
    );
    when(translateService.get(anything())).thenReturn(of([]));

    await TestBed.configureTestingModule({
      imports: [],
      providers: [
        { provide: AppFacade, useFactory: () => instance(appFacade) },
        { provide: CompareFacade, useFactory: () => instance(mock(CompareFacade)) },
        { provide: CopilotFacade, useFactory: () => instance(copilotFacade) },
        { provide: ScriptLoaderService, useFactory: () => instance(scriptLoader) },
        { provide: ShoppingFacade, useFactory: () => instance(mock(ShoppingFacade)) },
        { provide: TranslateService, useFactory: () => instance(translateService) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CopilotComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    const copilotSpy = jest.spyOn(component, 'initializeCopilot');

    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();

    // check whether the Copilot was initialized
    expect(copilotSpy).toHaveBeenCalledOnce();
    expect(copilotSpy).toHaveBeenCalledWith(
      {
        apiHost: 'https://api.example.com',
        chatflowid: 'xxxx-xxxx-xxxx-xxxx-xxxx',
        copilotUIFile: 'https://ui.example.com/web.js',
      },
      [],
      'https://icm/INTERSHOP/rest/WFS/Site/-;loc=en_US;cur=USD',
      'en_US',
      ''
    );
  });
});
