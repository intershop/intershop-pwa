import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { instance, mock } from 'ts-mockito';

import { SuggestService } from 'ish-core/services/suggest/suggest.service';
import { SearchBoxComponent } from '../../components/search-box/search-box.component';

import { SearchBoxContainerComponent } from './search-box.container';

describe('Search Box Container', () => {
  let component: SearchBoxContainerComponent;
  let fixture: ComponentFixture<SearchBoxContainerComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, TranslateModule.forRoot()],
      declarations: [MockComponent(SearchBoxComponent), SearchBoxContainerComponent],
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
  }));

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
