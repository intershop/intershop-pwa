import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { FooterComponent } from './footer.component';

describe('Footer Component', () => {
  let fixture: ComponentFixture<FooterComponent>;
  let element: HTMLElement;
  let component: FooterComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CollapseModule.forRoot(),
        ModalModule.forRoot(),
        PopoverModule.forRoot(),
      ],
      declarations: [
        FooterComponent,
      ]
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(FooterComponent);
      component = fixture.componentInstance;
      element = fixture.nativeElement;
    });
  }));

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(function() { fixture.detectChanges(); }).not.toThrow();
  });
});
