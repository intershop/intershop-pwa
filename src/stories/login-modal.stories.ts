import { moduleMetadata, storiesOf } from '@storybook/angular';

import { defaultModuleMetadata } from './storybook-helper';

storiesOf('ish-login-modal', module)
  .addDecorator(moduleMetadata(defaultModuleMetadata))
  .add('default', () => ({
    template: `<ish-login-modal></ish-login-modal>`,
  }))
  .add('messageKey', () => ({
    template: `<ish-login-modal loginMessageKey="profile_settings"></ish-login-modal>`,
  }));
