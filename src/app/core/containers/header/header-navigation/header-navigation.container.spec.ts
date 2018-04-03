import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { of } from 'rxjs/observable/of';
import { anything, instance, mock, when } from 'ts-mockito/lib/ts-mockito';
import { MockComponent } from '../../../../utils/dev/mock.component';
import { CoreState } from '../../../store/core.state';
import { HeaderNavigationContainerComponent } from './header-navigation.container';

describe('Header Navigation Container', () => {
  let component: HeaderNavigationContainerComponent;
  let fixture: ComponentFixture<HeaderNavigationContainerComponent>;
  let element: HTMLElement;
  let storeMock$: Store<CoreState>;

  beforeEach(async(() => {
    storeMock$ = mock(Store);
    when(storeMock$.pipe(anything())).thenReturn(of({}));

    TestBed.configureTestingModule({
      declarations: [
        MockComponent({
          selector: 'ish-header-navigation',
          template: 'Header Navigation',
          inputs: ['categories'],
        }),
        HeaderNavigationContainerComponent,
      ],
      providers: [
        { provide: Store, useFactory: () => instance(storeMock$) },
      ]
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(HeaderNavigationContainerComponent);
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
