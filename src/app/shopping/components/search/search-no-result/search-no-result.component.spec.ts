import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SearchNoResultComponent } from './search-no-result.component';

describe('SearchNoResultComponent', () => {
  let component: SearchNoResultComponent;
  let fixture: ComponentFixture<SearchNoResultComponent>;
  let element: HTMLElement;
  let translate: TranslateService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot()
      ],
      declarations: [
        SearchNoResultComponent
      ],
      providers: [
        TranslateService
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchNoResultComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    translate = TestBed.get(TranslateService);
    translate.setDefaultLang('en');
    translate.use('en');
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
