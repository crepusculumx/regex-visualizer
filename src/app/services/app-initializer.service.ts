import { inject, provideAppInitializer } from '@angular/core';
import { NzThemeService, NzThemeType } from './nz-theme.service';

export const AppInitializerProvider = provideAppInitializer(() => {
  const initializerFn = ((themeService: NzThemeService) => () => {
    return themeService.loadTheme(NzThemeType.default, true);
  })(inject(NzThemeService));
  return initializerFn();
});
