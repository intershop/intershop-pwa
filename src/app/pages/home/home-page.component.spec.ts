import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { MockComponent, MockPipe } from 'ng-mocks';

import { ServerSettingPipe } from 'ish-core/pipes/server-setting.pipe';
import { ContentIncludeComponent } from 'ish-shared/cms/components/content-include/content-include.component';
import { PaymentPaypalComponent } from 'ish-shared/components/payment/payment-paypal/payment-paypal.component';

import { HomePageComponent } from './home-page.component';

describe('Home Page Component', () => {
  let component: HomePageComponent;
  let fixture: ComponentFixture<HomePageComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomePageComponent],
      providers: [provideTranslateService()],
    })
      .overrideComponent(HomePageComponent, {
        remove: {
          imports: [ContentIncludeComponent, PaymentPaypalComponent, ServerSettingPipe],
          providers: [provideTranslateService()],
        },
        add: {
          imports: [
            MockComponent(ContentIncludeComponent),
            MockComponent(PaymentPaypalComponent),
            MockPipe(ServerSettingPipe),
          ],
          providers: [provideTranslateService()],
        },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomePageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render home page include when rendered', () => {
    fixture.detectChanges();
    expect(element).toMatchInlineSnapshot(`
      <h1 class="visually-hidden">seo.title.home</h1>
      <ish-content-include
        includeid="include.homepage.content.pagelet2-Include"
        ng-reflect-include-id="include.homepage.content.pagel"
      ></ish-content-include>
    `);
  });
});
