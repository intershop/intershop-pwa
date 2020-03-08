import { RouterTestingModule } from '@angular/router/testing';
import { noop } from 'rxjs';

import { CoreModule } from 'ish-core/core.module';
import { ThemeService } from 'ish-core/utils/theme/theme.service';
import { SharedModule } from 'ish-shared/shared.module';

export const defaultModuleMetadata = {
  imports: [CoreModule, SharedModule, RouterTestingModule],
  providers: [{ provide: ThemeService, useValue: { init: noop } }],
};
