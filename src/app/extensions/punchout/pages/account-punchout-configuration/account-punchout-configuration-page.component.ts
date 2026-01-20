import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ConfigOption } from '@ngx-formly/core';
import { TranslateModule } from '@ngx-translate/core';

import { OciConfigurationMappingRepeatFieldComponent } from './formly/oci-configuration-mapping-repeat-field/oci-configuration-mapping-repeat-field.component';
import { OciConfigurationMappingWrapperComponent } from './formly/oci-configuration-mapping-wrapper/oci-configuration-mapping-wrapper.component';
import { OciConfigurationRepeatFieldComponent } from './formly/oci-configuration-repeat-field/oci-configuration-repeat-field.component';
import { OciConfigurationFormComponent } from './oci-configuration-form/oci-configuration-form.component';

@Component({
  selector: 'ish-account-punchout-configuration-page',
  templateUrl: './account-punchout-configuration-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [OciConfigurationFormComponent, TranslateModule],
})
export class AccountPunchoutConfigurationPageComponent {}

export const ociConfigurationFormlyConfig: ConfigOption = {
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
