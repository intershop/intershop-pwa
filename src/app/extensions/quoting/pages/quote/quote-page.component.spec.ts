import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { instance, mock } from 'ts-mockito';

import { ErrorMessageComponent } from 'ish-shared/components/common/error-message/error-message.component';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';

import { QuoteContextFacade } from '../../facades/quote-context.facade';
import { QuoteEditComponent } from '../../shared/quote-edit/quote-edit.component';
import { QuoteInteractionsComponent } from '../../shared/quote-interactions/quote-interactions.component';
import { QuoteViewComponent } from '../../shared/quote-view/quote-view.component';

import { QuotePageComponent } from './quote-page.component';

describe('Quote Page Component', () => {
  let component: QuotePageComponent;
  let fixture: ComponentFixture<QuotePageComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, TranslateModule.forRoot()],
      declarations: [
        MockComponent(ErrorMessageComponent),
        MockComponent(LoadingComponent),
        MockComponent(QuoteEditComponent),
        MockComponent(QuoteInteractionsComponent),
        MockComponent(QuoteViewComponent),
        QuotePageComponent,
      ],
    })
      .overrideComponent(QuotePageComponent, {
        set: { providers: [{ provide: QuoteContextFacade, useFactory: () => instance(mock(QuoteContextFacade)) }] },
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuotePageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
