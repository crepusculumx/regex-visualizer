import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Menus } from '../interfaces/menu';

@Injectable({
  providedIn: 'root',
})
export class MenusService {
  private _menus$ = new BehaviorSubject<Menus>([]);
  get menus$(): Observable<Menus> {
    return this._menus$.asObservable();
  }

  public setMenus(menus: Menus) {
    this._menus$.next(menus);
  }
}
