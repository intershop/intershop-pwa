import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfigOption, FormlyModule } from '@ngx-formly/core';

import { PunchoutModule } from '../../punchout.module';

import { AccountPunchoutConfigurationPageComponent } from './account-punchout-configuration-page.component';
import { OciConfigurationMappingRepeatFieldComponent } from './formly/oci-configuration-mapping-repeat-field/oci-configuration-mapping-repeat-field.component';
import { OciConfigurationMappingWrapperComponent } from './formly/oci-configuration-mapping-wrapper/oci-configuration-mapping-wrapper.component';
import { OciConfigurationRepeatFieldComponent } from './formly/oci-configuration-repeat-field/oci-configuration-repeat-field.component';
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
      name: 'repeat-oci-config',
      component: OciConfigurationRepeatFieldComponent,
    },
    {
      name: 'repeat-oci-configuration-mapping',
      component: OciConfigurationMappingRepeatFieldComponent,
    },
  ],
  wrappers: [
    {
      name: 'oci-configuration-mapping-wrapper',
      component: OciConfigurationMappingWrapperComponent,
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
    OciConfigurationMappingRepeatFieldComponent,
    OciConfigurationMappingWrapperComponent,
    OciConfigurationRepeatFieldComponent,
  ],
})
export class AccountPunchoutConfigurationPageModule {}
