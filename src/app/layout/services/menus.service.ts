import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Menus } from '../interfaces/menu';

@Injectable({
  providedIn: 'root',
})
export class MenusService {
  private _menus$ = new BehaviorSubject<Menus>([
    {
      title: '模型可视化',
      level: 1,
      icon: '',
      selected: false,
      disabled: false,
      open: true,
      children: [
        {
          title: 'DFA',
          level: 2,
          icon: '',
          selected: false,
          disabled: false,
          routerLink: ['dfa'],
        },
      ],
    },
    {
      title: '模型转化',
      level: 1,
      icon: '',
      selected: false,
      disabled: false,
      open: true,
      children: [
        {
          title: 'DFA极小化',
          level: 2,
          icon: '',
          selected: false,
          disabled: false,
          routerLink: ['dfa-minimize'],
        },
      ],
    },
  ]);
  get menus$(): Observable<Menus> {
    return this._menus$.asObservable();
  }

  public setMenus(menus: Menus) {
    this._menus$.next(menus);
  }
}
