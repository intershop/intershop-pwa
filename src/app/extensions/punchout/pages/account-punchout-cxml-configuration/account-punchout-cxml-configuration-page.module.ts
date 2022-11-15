import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormlyModule as FormlyBaseModule } from '@ngx-formly/core';

import { PunchoutModule } from '../../punchout.module';

import { AccountPunchoutCxmlConfigurationPageComponent } from './account-punchout-cxml-configuration-page.component';
import { CxmlConfigurationFormComponent } from './cxml-configuration-form/cxml-configuration-form.component';
import { CxmlHelpTextWrapperComponent } from './formly/cxml-help-text-wrapper/cxml-help-text-wrapper.component';

const accountPunchoutCxmlConfigurationPageRoutes: Routes = [
  {
    path: '',
    data: {
      breadcrumbData: [
        { key: 'account.punchout.link', link: '/account/punchout' },
        { key: 'account.punchout.cxml.configuration.link' },
      ],
    },
    component: AccountPunchoutCxmlConfigurationPageComponent,
  },
];

const wrapperComponents = [CxmlHelpTextWrapperComponent];

@NgModule({
  imports: [
    RouterModule.forChild(accountPunchoutCxmlConfigurationPageRoutes),
    PunchoutModule,
    FormlyBaseModule.forChild({
      wrappers: [{ name: 'cxml-help-text', component: CxmlHelpTextWrapperComponent }],
    }),
  ],
  declarations: [AccountPunchoutCxmlConfigurationPageComponent, CxmlConfigurationFormComponent, ...wrapperComponents],
})
export class AccountPunchoutCxmlConfigurationPageModule {}
