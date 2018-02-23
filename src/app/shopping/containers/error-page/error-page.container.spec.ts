import { ComponentFixture } from '@angular/core/testing';
import { async, TestBed } from '@angular/core/testing';
import { ErrorPageContainerComponent } from './error-page.container';

describe('Error Page Container', () => {
  let fixture: ComponentFixture<ErrorPageContainerComponent>;
  let element: HTMLElement;
  let component: ErrorPageContainerComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ErrorPageContainerComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorPageContainerComponent);
    element = fixture.nativeElement;
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(function() { fixture.detectChanges(); }).not.toThrow();
  });

  it('should test if tags with their text are getting rendered on the HTML', () => {
    expect(element.getElementsByTagName('h3')[0].textContent).toContain('We are sorry');
    expect(element.getElementsByTagName('p')[0].textContent).toContain('The page you are looking for is currently not available');
    expect(element.getElementsByTagName('h4')[0].textContent).toContain('Please try one of the following:');
    expect(element.getElementsByClassName('btn-primary')[0].textContent).toContain('Search');
  });
});
