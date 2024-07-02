export interface Menu {
  level: number;
  title: string;
  icon: string | null;
  selected: boolean;
  disabled: boolean;
  routerLink?: string[];
  open?: boolean;
  children?: Menu[];
}

export type Menus = Menu[];
