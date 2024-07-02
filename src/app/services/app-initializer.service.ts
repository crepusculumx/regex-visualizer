import { APP_INITIALIZER } from '@angular/core';
import { NzThemeService, NzThemeType } from './nz-theme.service';

export const AppInitializerProvider = {
  provide: APP_INITIALIZER,
  useFactory: (themeService: NzThemeService) => () => {
    return themeService.loadTheme(NzThemeType.default, true);
  },
  deps: [NzThemeService],
  multi: true,
};
