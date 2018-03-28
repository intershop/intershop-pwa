import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { SmallHeaderComponent } from './small-header.component';

describe('Small Header Component', () => {
  let fixture: ComponentFixture<SmallHeaderComponent>;
  let element: HTMLElement;
  let component: SmallHeaderComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CollapseModule.forRoot(),
        ModalModule.forRoot(),
        PopoverModule.forRoot(),
      ],
      declarations: [
        SmallHeaderComponent,
      ]
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(SmallHeaderComponent);
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
