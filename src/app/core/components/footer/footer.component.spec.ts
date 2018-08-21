import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';

import { MEDIUM_BREAKPOINT_WIDTH } from '../../configurations/injection-keys';
import { IconModule } from '../../icon.module';

import { FooterComponent } from './footer.component';

describe('Footer Component', () => {
  let fixture: ComponentFixture<FooterComponent>;
  let element: HTMLElement;
  let component: FooterComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NgbCollapseModule, IconModule],
      declarations: [FooterComponent],
      providers: [{ provide: MEDIUM_BREAKPOINT_WIDTH, useValue: 768 }],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(FooterComponent);
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
