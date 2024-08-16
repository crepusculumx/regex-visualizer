import { Component, signal } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MenusComponent } from './widgets/menus/menus.component';
import { ThemeService } from '../../services/theme.service';
import { MenusService } from '../services/menus.service';
import { delay, Observable } from 'rxjs';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { Menus } from '../interfaces/menu';
import { NzResizableModule, NzResizeEvent } from 'ng-zorro-antd/resizable';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-basic-layout',
  standalone: true,
  imports: [
    CommonModule,
    NzLayoutModule,
    NzIconModule,
    RouterOutlet,
    MenusComponent,
    RouterLink,
    NgOptimizedImage,
    NzResizableModule,
  ],
  templateUrl: './basic-layout.component.html',
  styleUrl: './basic-layout.component.less',
})
export class BasicLayoutComponent {
  constructor(
    public themeService: ThemeService,
    public menuService: MenusService,
  ) {}

  public isCollapsed = signal(false);

  //ExpressionChangedAfterItHasBeenCheckedError
  //如果子组件构造时立刻通知修改menus，则会出现在变更检测中子组件更改父组件的情形
  //通过delay(0)延迟到下一个周期变更检测周期
  private menus$: Observable<Menus> = this.menuService.menus$.pipe(delay(0));
  public menus = toSignal(this.menus$);

  public siderWidth = signal(300);
  private frameId = -1;

  onSideResize({ width }: NzResizeEvent): void {
    cancelAnimationFrame(this.frameId);
    this.frameId = requestAnimationFrame(() => {
      this.siderWidth.set(width!);
    });
  }
}
