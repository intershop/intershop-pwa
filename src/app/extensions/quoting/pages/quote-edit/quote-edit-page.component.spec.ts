import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';

import { QuotingFacade } from '../../facades/quoting.facade';
import { QuoteEditComponent } from '../../shared/quote-edit/quote-edit.component';

import { QuoteEditPageComponent } from './quote-edit-page.component';

describe('Quote Edit Page Component', () => {
  let component: QuoteEditPageComponent;
  let fixture: ComponentFixture<QuoteEditPageComponent>;
  let element: HTMLElement;
  let quotingFacade: QuotingFacade;

  beforeEach(async(() => {
    quotingFacade = mock(QuotingFacade);

    TestBed.configureTestingModule({
      declarations: [MockComponent(LoadingComponent), MockComponent(QuoteEditComponent), QuoteEditPageComponent],
      imports: [
        RouterTestingModule.withRoutes([{ path: 'basket', component: QuoteEditPageComponent }]),
        TranslateModule.forRoot(),
      ],
      providers: [
        { provide: AccountFacade, useFactory: () => instance(mock(AccountFacade)) },
        { provide: QuotingFacade, useFactory: () => instance(quotingFacade) },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteEditPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render loading component if quotes loading', () => {
    when(quotingFacade.quoteLoading$).thenReturn(of(true));

    fixture.detectChanges();
    expect(element.querySelector('ish-loading')).toBeTruthy();
  });
});
