import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ServerErrorPageComponent } from './server-error-page.component';

describe('Server Error Page Component', () => {
  let fixture: ComponentFixture<ServerErrorPageComponent>;
  let element: HTMLElement;
  let component: ServerErrorPageComponent;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [ServerErrorPageComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ServerErrorPageComponent);
    element = fixture.nativeElement;
    component = fixture.componentInstance;
    component.error = { current: { status: 0 } };
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render a server timeout error content on the HTML', () => {
    component.error = { current: { status: 0 }, type: 'Error' };
    fixture.detectChanges();
    expect(element.getElementsByTagName('h3')[0].textContent).toContain('We are sorry');
    expect(element.getElementsByTagName('h4')[0].textContent).toContain('Please go back to the');
    expect(element.querySelector('p.text-muted').textContent).toContain('Server timeout');
  });

  it('should render a 5xx error content on the HTML', () => {
    component.error = { current: { status: 500 }, type: 'Error' };
    fixture.detectChanges();
    expect(element.getElementsByTagName('h3')[0].textContent).toContain('We are sorry');
    expect(element.getElementsByTagName('h4')[0].textContent).toContain('Please go back to the');
    expect(element.querySelector('p.text-muted').textContent).toContain('Error');
    expect(element.querySelector('p.text-muted').textContent).toContain('Error code 500');
  });

  it('should render the error type if it is available', () => {
    component.error = { current: { status: 500 }, type: 'Error' };
    fixture.detectChanges();
    const a = element.querySelector('p.text-muted');
    expect(a).toBeTruthy();
    expect(a.textContent).toContain('Error');
  });
});
