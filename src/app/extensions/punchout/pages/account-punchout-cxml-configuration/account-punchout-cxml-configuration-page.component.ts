import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ConfigOption } from '@ngx-formly/core';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';

import { PunchoutFacade } from '../../facades/punchout.facade';
import { CxmlConfiguration } from '../../models/cxml-configuration/cxml-configuration.model';
import { PunchoutUser } from '../../models/punchout-user/punchout-user.model';

import { CxmlConfigurationFormComponent } from './cxml-configuration-form/cxml-configuration-form.component';
import { CxmlHelpTextWrapperComponent } from './formly/cxml-help-text-wrapper/cxml-help-text-wrapper.component';

@Component({
  selector: 'ish-account-punchout-cxml-configuration-page',
  templateUrl: './account-punchout-cxml-configuration-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    AsyncPipe,
    CxmlConfigurationFormComponent,
    CxmlHelpTextWrapperComponent,
    LoadingComponent,
    NgIf,
    TranslateModule,
  ],
})
export class AccountPunchoutCxmlConfigurationPageComponent implements OnInit {
  selectedUser$: Observable<PunchoutUser>;
  cxmlConfiguration$: Observable<CxmlConfiguration[]>;
  loading$: Observable<boolean>;

  constructor(private punchoutFacade: PunchoutFacade) {}

  ngOnInit() {
    this.selectedUser$ = this.punchoutFacade.selectedPunchoutUser$;
    this.cxmlConfiguration$ = this.punchoutFacade.cxmlConfiguration$();
    this.loading$ = this.punchoutFacade.cxmlConfigurationLoading$;
  }
}

export const cxmlConfigurationFormlyConfig: ConfigOption = {
  wrappers: [{ name: 'cxml-help-text', component: CxmlHelpTextWrapperComponent }],
};
