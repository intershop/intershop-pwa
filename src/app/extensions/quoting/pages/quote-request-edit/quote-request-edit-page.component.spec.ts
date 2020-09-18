import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';

import { QuotingFacade } from '../../facades/quoting.facade';
import { QuoteEditComponent } from '../../shared/quote-edit/quote-edit.component';

import { QuoteRequestEditPageComponent } from './quote-request-edit-page.component';

describe('Quote Request Edit Page Component', () => {
  let component: QuoteRequestEditPageComponent;
  let fixture: ComponentFixture<QuoteRequestEditPageComponent>;
  let element: HTMLElement;
  let quotingFacade: QuotingFacade;

  beforeEach(async () => {
    quotingFacade = mock(QuotingFacade);
    await TestBed.configureTestingModule({
      declarations: [MockComponent(LoadingComponent), MockComponent(QuoteEditComponent), QuoteRequestEditPageComponent],
      imports: [RouterTestingModule, TranslateModule.forRoot()],
      providers: [
        { provide: QuotingFacade, useFactory: () => instance(quotingFacade) },
        { provide: AccountFacade, useFactory: () => instance(mock(AccountFacade)) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteRequestEditPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render loading component if quote requests loading', () => {
    when(quotingFacade.quoteRequestLoading$).thenReturn(of(true));

    fixture.detectChanges();
    expect(element.querySelector('ish-loading')).toBeTruthy();
  });
});
