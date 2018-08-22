import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { ServerErrorPageComponent } from './server-error-page.component';

describe('Server Error Page Component', () => {
  let fixture: ComponentFixture<ServerErrorPageComponent>;
  let element: HTMLElement;
  let component: ServerErrorPageComponent;
  let translate: TranslateService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [ServerErrorPageComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServerErrorPageComponent);
    element = fixture.nativeElement;
    component = fixture.componentInstance;
    component.error = { current: { status: 0 } };
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
    component.error = { current: { status: 500 }, type: 'Error' };
    fixture.detectChanges();
    const a = element.querySelector('p.text-muted');
    expect(a).toBeTruthy();
    expect(a.textContent).toContain('Error');
  });

  it('should render a server timeout error content on template', () => {
    component.error = { current: { status: 0 }, type: 'Error' };
    fixture.detectChanges();
    expect(element.querySelector('p.text-muted').textContent).toContain('Server timeout');
  });

  it('should render a 5xx error content on template', () => {
    component.error = { current: { status: 500 }, type: 'Error' };
    fixture.detectChanges();
    expect(element.querySelector('p.text-muted').textContent).toContain('Error code 500');
  });
});
