import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ComparePageComponent } from './compare-page.component';
import { GlobalState } from '../../shared/services'

describe('ComparePageComponent', () => {
  let component: ComparePageComponent;
  let fixture: ComponentFixture<ComparePageComponent>;

  beforeEach(async(() => {
    class GlobalStatestub {
      subscribeCachedData(key, callBack: Function) {

      }
    }

    TestBed.configureTestingModule({
      declarations: [ComparePageComponent],
      providers: [{ provide: GlobalState, useClass: GlobalStatestub }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComparePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', async(() => {
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});
