import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { PipesModule } from 'ish-core/pipes.module';
import { findAllIshElements } from 'ish-core/utils/dev/html-query-utils';

import { SearchBoxContainerComponent } from '../../../../shell/header/containers/search-box/search-box.container';

import { ErrorPageComponent } from './error-page.component';

describe('Error Page Component', () => {
  let fixture: ComponentFixture<ErrorPageComponent>;
  let element: HTMLElement;
  let component: ErrorPageComponent;
  let translate: TranslateService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [PipesModule, TranslateModule.forRoot()],
      declarations: [ErrorPageComponent, MockComponent(SearchBoxContainerComponent)],
    }).compileComponents();
  }));

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
