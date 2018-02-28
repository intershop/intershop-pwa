import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { instance, mock } from 'ts-mockito/lib/ts-mockito';
import { MockComponent } from '../../../utils/dev/mock.component';
import { RecentlyPageContainerComponent } from './recently-page.container';

describe('RecentlyPage.ContainerComponent', () => {
  let component: RecentlyPageContainerComponent;
  let fixture: ComponentFixture<RecentlyPageContainerComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        RecentlyPageContainerComponent,
        MockComponent({ selector: 'ish-recently-viewed', template: 'Recently Viewed Component', inputs: ['products'] })
      ],
      imports: [
        TranslateModule.forRoot()
      ],
      providers: [
        { provide: Store, useFactory: () => instance(mock(Store)) }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecentlyPageContainerComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(function() { fixture.detectChanges(); }).not.toThrow();
  });
});
