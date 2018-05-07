import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { findAllIshElements } from '../../../../utils/dev/html-query-utils';
import { MockComponent } from '../../../../utils/dev/mock.component';
import { ErrorPageComponent } from './error-page.component';

describe('Error Page Component', () => {
  let fixture: ComponentFixture<ErrorPageComponent>;
  let element: HTMLElement;
  let component: ErrorPageComponent;
  let translate: TranslateService;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [TranslateModule.forRoot()],
        declarations: [
          ErrorPageComponent,
          MockComponent({
            selector: 'ish-search-box-container',
            template: 'Search Box Container',
            inputs: ['buttonText', 'placeholderText', 'autoSuggest', 'maxAutoSuggests'],
          }),
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorPageComponent);
    element = fixture.nativeElement;
    component = fixture.componentInstance;
    translate = TestBed.get(TranslateService);
    translate.setDefaultLang('en_US');
    translate.use('en_US');
    translate.set('error.page.text', '<h3>test paragraph title</h3>');
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render localized error text with HTML on template', () => {
    fixture.detectChanges();
    expect(element.getElementsByTagName('h3')[0].textContent).toContain('test paragraph title');
  });

  it('should render search box on template', () => {
    fixture.detectChanges();
    expect(findAllIshElements(element)).toEqual(['ish-search-box-container']);
  });
});
