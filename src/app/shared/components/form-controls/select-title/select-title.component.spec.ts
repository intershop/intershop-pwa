import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectTitleComponent } from './select-title.component';

describe('SelectTitleComponent', () => {
  let component: SelectTitleComponent;
  let fixture: ComponentFixture<SelectTitleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SelectTitleComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
