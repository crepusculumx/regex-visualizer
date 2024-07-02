import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  get<T>(key: string): T {
    const res: string | null = localStorage.getItem(key);
    if (res === null) {
      throw new Error(`localStorage key error: ${key}`);
    }
    return JSON.parse(res);
  }

  set<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  has(key: string): boolean {
    return localStorage.getItem(key) != null;
  }

  remove(key: string) {
    localStorage.removeItem(key);
  }
}
