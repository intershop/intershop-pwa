import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfigOption, FormlyModule } from '@ngx-formly/core';

import { PunchoutModule } from '../../punchout.module';

import { AccountPunchoutConfigurationPageComponent } from './account-punchout-configuration-page.component';
import { OciConfigurationRepeatFieldComponent } from './formly/oci-configuration-repeat-field/oci-configuration-repeat-field.component';
import { OciConfigurationRepeatMappingFieldComponent } from './formly/oci-configuration-repeat-mapping-field/oci-configuration-repeat-mapping-field.component';
import { OciConfigurationFormComponent } from './oci-configuration-form/oci-configuration-form.component';

const accountPunchoutConfigurationPageRoutes: Routes = [
  {
    path: '',
    data: {
      breadcrumbData: [
        { key: 'account.punchout.link', link: '/account/punchout' },
        { key: 'account.punchout.configuration.link' },
      ],
    },
    component: AccountPunchoutConfigurationPageComponent,
  },
];

const ociConfigurationFormlyConfig: ConfigOption = {
  types: [
    {
      name: 'repeatOciConfig',
      component: OciConfigurationRepeatFieldComponent,
    },
    {
      name: 'repeat-oci-configuration-mapping',
      component: OciConfigurationRepeatMappingFieldComponent,
    },
  ],
};

@NgModule({
  imports: [
    FormlyModule.forChild(ociConfigurationFormlyConfig),
    RouterModule.forChild(accountPunchoutConfigurationPageRoutes),
    PunchoutModule,
  ],

  declarations: [
    AccountPunchoutConfigurationPageComponent,
    OciConfigurationFormComponent,
    OciConfigurationRepeatFieldComponent,
    OciConfigurationRepeatMappingFieldComponent,
  ],
})
export class AccountPunchoutConfigurationPageModule {}
