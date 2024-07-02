import { Injectable } from '@angular/core';
import { NzThemeService, NzThemeType } from './nz-theme.service';
import { BehaviorSubject } from 'rxjs';
import { LocalStorageService } from './local-storage.service';

export enum ThemeType {
  dark = 'dark',
  default = 'default',
}

interface Preference {
  defaultTheme: ThemeType;
}

const defaultPreference: Preference = {
  defaultTheme: ThemeType.default,
};

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private prefCacheKey = 'themeServicePreferences';
  private preference: Preference = this.localStorageService.has(
    this.prefCacheKey,
  )
    ? this.localStorageService.get<Preference>(this.prefCacheKey)
    : defaultPreference;

  public currentTheme$ = new BehaviorSubject<ThemeType>(
    this.preference.defaultTheme,
  );
  constructor(
    private nzThemeService: NzThemeService,
    private localStorageService: LocalStorageService,
  ) {
    this.currentTheme$.subscribe((theme: ThemeType) => {
      this.preference.defaultTheme = theme;
      this.localStorageService.set(this.prefCacheKey, this.preference);
      this.nzThemeService.loadTheme(theme as string as NzThemeType).then();
    });
  }

  private reverseTheme(theme: string): ThemeType {
    return theme === ThemeType.dark ? ThemeType.default : ThemeType.dark;
  }
  public toggleTheme(): void {
    this.currentTheme$.next(this.reverseTheme(this.currentTheme$.value));
  }
}
