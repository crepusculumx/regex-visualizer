import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { RouterLink } from '@angular/router';
import { Menus } from '../../../interfaces/menu';

@Component({
  selector: 'app-layout-menus',
  standalone: true,
  imports: [CommonModule, NzMenuModule, NzIconModule, RouterLink],
  templateUrl: './menus.component.html',
  styleUrl: './menus.component.less',
})
export class MenusComponent {
  @Input({ required: true }) menus: Menus = [];
}
