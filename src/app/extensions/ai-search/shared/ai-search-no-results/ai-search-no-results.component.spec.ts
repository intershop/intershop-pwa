import { APP_BASE_HREF } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslatePipe, TranslateService, provideTranslateService } from '@ngx-translate/core';
import { instance, mock } from 'ts-mockito';

import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { AppFacade } from 'ish-core/facades/app.facade';
import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { FeatureTogglePipe } from 'ish-core/pipes/feature-toggle.pipe';

import translations from '../../../../../assets/i18n/en_US.json';

import { AiSearchNoResultsComponent } from './ai-search-no-results.component';

describe('Ai Search No Results Component', () => {
  let component: AiSearchNoResultsComponent;
  let fixture: ComponentFixture<AiSearchNoResultsComponent>;
  let element: HTMLElement;

  async function setup(...features: Parameters<typeof FeatureToggleModule.forTesting>) {
    await TestBed.configureTestingModule({
      imports: [FeatureToggleModule.forTesting(...features), TranslatePipe],
      declarations: [AiSearchNoResultsComponent, FeatureTogglePipe, ServerHtmlDirective],
      providers: [
        { provide: APP_BASE_HREF, useValue: '/' },
        { provide: AppFacade, useFactory: () => instance(mock(AppFacade)) },
        provideRouter([]),
        provideTranslateService(),
      ],
    }).compileComponents();

    const translate = TestBed.inject(TranslateService);
    translate.setTranslation('en', translations);
    translate.use('en');

    fixture = TestBed.createComponent(AiSearchNoResultsComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  }

  describe('UC-001 with the AI Product Advisor offered', () => {
    beforeEach(() => setup('copilotEmbedded'));

    it('should be created', () => {
      expect(component).toBeTruthy();
      expect(element).toBeTruthy();
      expect(() => fixture.detectChanges()).not.toThrow();
    });

    it('should point the buyer to the AI Product Advisor (A1, BR-010)', () => {
      fixture.detectChanges();

      const link = element.querySelector('a');
      expect(element.textContent.trim()).toEqual('Ask our AI Product Advisor for help with your search.');
      expect(link.textContent).toEqual('AI Product Advisor');
      expect(link.getAttribute('href')).toEqual('/copilot');
    });

    it('should show no AI answer on the no-results page (BR-011)', () => {
      fixture.detectChanges();

      expect(element.querySelector('.ai-search-answer-box, .ai-search-answer, [data-ai-generated]')).toBeFalsy();
    });
  });

  describe('UC-001 without the AI Product Advisor offered', () => {
    beforeEach(() => setup());

    it('should not point the buyer to the AI Product Advisor (BR-010, C-003)', () => {
      fixture.detectChanges();

      expect(element.textContent.trim()).toBeEmpty();
    });
  });
});
