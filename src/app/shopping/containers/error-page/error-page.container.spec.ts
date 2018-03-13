import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { of } from 'rxjs/observable/of';
import { anything, instance, mock, when } from 'ts-mockito/lib/ts-mockito';
import { CoreState } from '../../../core/store/core.state';
import { ErrorPageContainerComponent } from './error-page.container';

describe('Error Page Container', () => {
  let fixture: ComponentFixture<ErrorPageContainerComponent>;
  let element: HTMLElement;
  let component: ErrorPageContainerComponent;

  let storeMock: Store<CoreState>;

  beforeEach(async(() => {
    storeMock = mock(Store);

    when(storeMock.pipe(anything())).thenReturn(of({}) as any);

    TestBed.configureTestingModule({
      declarations: [ErrorPageContainerComponent],
      providers: [
        { provide: Store, useFactory: () => instance(storeMock) }
      ],
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
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render error content on the HTML', () => {
    expect(element.getElementsByTagName('h3')[0].textContent).toContain('We are sorry');
    expect(element.getElementsByTagName('p')[0].textContent).toContain('The page you are looking for is currently not available');
    expect(element.getElementsByTagName('h4')[0].textContent).toContain('Please try one of the following:');
    expect(element.getElementsByClassName('btn-primary')[0].textContent).toContain('Search');
  });
});
