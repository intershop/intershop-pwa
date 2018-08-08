import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { instance, mock } from 'ts-mockito';
import { MockComponent } from '../../../../utils/dev/mock.component';
import { LanguageSwitchContainerComponent } from './language-switch.container';

describe('Language Switch Container', () => {
  let component: LanguageSwitchContainerComponent;
  let fixture: ComponentFixture<LanguageSwitchContainerComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MockComponent({
          selector: 'ish-language-switch',
          template: 'Language Switch',
          inputs: ['locale', 'availableLocales'],
        }),
        LanguageSwitchContainerComponent,
      ],
      providers: [{ provide: Store, useFactory: () => instance(mock(Store)) }],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(LanguageSwitchContainerComponent);
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
