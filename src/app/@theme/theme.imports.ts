import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import {
  NbThemeModule,
  NbLayoutModule,
  NbSidebarModule,
  NbMenuModule,
  NbSearchModule,
  NbActionsModule,
  NbUserModule,
  NbContextMenuModule,
  NbButtonModule,
  NbSelectModule,
  NbIconModule,
  NbCardModule,
  NbDialogModule,
  NbToastrModule,
  NbWindowModule,
} from '@nebular/theme';

import { DEFAULT_THEME } from './styles/theme.default';
import { COSMIC_THEME } from './styles/theme.cosmic';
import { CORPORATE_THEME } from './styles/theme.corporate';
import { DARK_THEME } from './styles/theme.dark';

export function provideNebular(): EnvironmentProviders {
  return makeEnvironmentProviders([
    NbThemeModule.forRoot(
      { name: 'default' },
      [DEFAULT_THEME, COSMIC_THEME, CORPORATE_THEME, DARK_THEME]
    ).providers!,
    NbToastrModule.forRoot().providers!,
    NbWindowModule.forRoot().providers!,
    NbSidebarModule.forRoot().providers!,
    NbLayoutModule,
    NbMenuModule,
    NbSearchModule,
    NbActionsModule,
    NbUserModule,
    NbContextMenuModule,
    NbButtonModule,
    NbSelectModule,
    NbIconModule,
    NbCardModule,
    NbDialogModule,
  ]);
}