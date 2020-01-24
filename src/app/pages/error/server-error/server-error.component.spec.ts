import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { SafeHtmlPipe } from 'ish-core/pipes/safe-html.pipe';

import { ServerErrorComponent } from './server-error.component';

describe('Server Error Component', () => {
  let fixture: ComponentFixture<ServerErrorComponent>;
  let element: HTMLElement;
  let component: ServerErrorComponent;
  let translate: TranslateService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [SafeHtmlPipe, ServerErrorComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServerErrorComponent);
    element = fixture.nativeElement;
    component = fixture.componentInstance;
    component.error = { status: 0 } as HttpError;
    translate = TestBed.get(TranslateService);
    translate.setDefaultLang('en_US');
    translate.use('en_US');
    translate.set('servererror.page.text', '<h3>test paragraph title</h3>');
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render error text includes HTML on template', () => {
    fixture.detectChanges();
    expect(element.getElementsByTagName('h3')[0].textContent).toContain('test paragraph title');
  });

  it('should render the error type if it is available', () => {
    component.error = { status: 500 } as HttpError;
    component.type = 'Error';
    fixture.detectChanges();
    const a = element.querySelector('p.text-muted');
    expect(a).toBeTruthy();
    expect(a.textContent).toContain('Error');
  });

  it('should render a server timeout error content on template', () => {
    component.error = { status: 0 } as HttpError;
    component.type = 'Error';
    fixture.detectChanges();
    expect(element.querySelector('p.text-muted').textContent).toContain('Server timeout');
  });

  it('should render a 5xx error content on template', () => {
    component.error = { status: 500 } as HttpError;
    component.type = 'Error';
    fixture.detectChanges();
    expect(element.querySelector('p.text-muted').textContent).toContain('Error code 500');
  });
});
