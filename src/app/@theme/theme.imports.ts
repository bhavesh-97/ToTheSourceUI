import {
  NbActionsModule,
  NbLayoutModule,
  NbMenuModule,
  NbSearchModule,
  NbSidebarModule,
  NbUserModule,
  NbContextMenuModule,
  NbButtonModule,
  NbSelectModule,
  NbIconModule,
  NbThemeModule,
} from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
// import { NbSecurityModule } from '@nebular/security';
import { CommonModule } from '@angular/common';
import { SharedImports } from '../shared/imports/shared-imports';

import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { SearchInputComponent } from './components/search-input/search-input.component';
import { TinyMCEComponent } from './components/tiny-mce/tiny-mce.component';
import { OneColumnLayoutComponent } from './layouts/one-column/one-column.layout';
import { TwoColumnsLayoutComponent } from './layouts/two-columns/two-columns.layout';
import { ThreeColumnsLayoutComponent } from './layouts/three-columns/three-columns.layout';

// Pipes
import { CapitalizePipe } from './pipes/capitalize.pipe';
import { PluralPipe } from './pipes/plural.pipe';
import { RoundPipe } from './pipes/round.pipe';
import { TimingPipe } from './pipes/timing.pipe';
import { NumberWithCommasPipe } from './pipes/number-with-commas.pipe';

// Nebular themes
import { DEFAULT_THEME } from './styles/theme.default';
import { COSMIC_THEME } from './styles/theme.cosmic';
import { CORPORATE_THEME } from './styles/theme.corporate';
import { DARK_THEME } from './styles/theme.dark';

export const THEME_IMPORTS = [
  CommonModule,
  SharedImports,
  NbLayoutModule,
  NbMenuModule,
  NbUserModule,
  NbActionsModule,
  NbSearchModule,
  NbSidebarModule,
  NbContextMenuModule,
//   NbSecurityModule,
  NbButtonModule,
  NbSelectModule,
  NbIconModule,
  NbEvaIconsModule,
  HeaderComponent,
  FooterComponent,
  SearchInputComponent,
  TinyMCEComponent,
  OneColumnLayoutComponent,
  TwoColumnsLayoutComponent,
  ThreeColumnsLayoutComponent,
  CapitalizePipe,
  PluralPipe,
  RoundPipe,
  TimingPipe,
  NumberWithCommasPipe,
];

// Initialize Nebular theme providers
const nbTheme = NbThemeModule.forRoot(
  { name: 'default' },
  [DEFAULT_THEME, COSMIC_THEME, CORPORATE_THEME, DARK_THEME]
);

export const THEME_PROVIDERS = [...(nbTheme.providers ?? [])];