import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { instance, mock } from 'ts-mockito/lib/ts-mockito';
import { MockComponent } from '../../../../utils/dev/mock.component';
import { SuggestService } from '../../../services/suggest/suggest.service';
import { SearchBoxContainerComponent } from './search-box.container';

describe('Search Box Container', () => {
  let component: SearchBoxContainerComponent;
  let fixture: ComponentFixture<SearchBoxContainerComponent>;
  let element: HTMLElement;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [TranslateModule.forRoot(), RouterTestingModule],
        declarations: [
          MockComponent({
            selector: 'ish-search-box',
            template: 'Search Box',
            inputs: [
              'results',
              'buttonText',
              'buttonTitleText',
              'placeholderText',
              'searchTerm',
              'autoSuggest',
              'maxAutoSuggests',
            ],
          }),
          SearchBoxContainerComponent,
        ],
        providers: [
          { provide: SuggestService, useFactory: () => instance(mock(SuggestService)) },
          { provide: Store, useFactory: () => instance(mock(Store)) },
        ],
      })
        .compileComponents()
        .then(() => {
          fixture = TestBed.createComponent(SearchBoxContainerComponent);
          component = fixture.componentInstance;
          element = fixture.nativeElement;
        });
    })
  );

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
