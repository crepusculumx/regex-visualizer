import { Component, inject } from '@angular/core';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { BehaviorSubject, combineLatest, map, switchMap, tap } from 'rxjs';
import { FaDbService, FaType } from '../../../services/fa-db.service';
import { NzTableModule } from 'ng-zorro-antd/table';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzCheckboxModule, NzCheckboxOption } from 'ng-zorro-antd/checkbox';
import { FormsModule } from '@angular/forms';
import { NzCardModule } from 'ng-zorro-antd/card';

@Component({
  selector: 'app-fa-list',
  imports: [
    NzPageHeaderModule,
    NzTableModule,
    AsyncPipe,
    RouterLink,
    NzButtonModule,
    NzDividerModule,
    NzCheckboxModule,
    FormsModule,
    NzCardModule,
  ],
  templateUrl: './fa-list.component.html',
  styleUrl: './fa-list.component.less',
})
export class FaListComponent {
  private readonly faDbService = inject(FaDbService);
  private readonly message = inject(NzMessageService);

  public readonly options: NzCheckboxOption[] = Object.keys(FaType).map(
    (key) => {
      return {
        value: key,
        label: key,
      };
    },
  );

  public readonly checkBoxValue$ = new BehaviorSubject(
    this.options.map((options) => {
      return options.value as string;
    }),
  );

  public readonly pageSize$ = new BehaviorSubject<number>(10);
  public readonly pageIndex$ = new BehaviorSubject<number>(1);
  public readonly total$ = new BehaviorSubject<number>(1);
  public readonly loading$ = new BehaviorSubject<boolean>(false);
  private readonly flush$ = new BehaviorSubject<boolean>(true);

  public readonly data$ = combineLatest([
    this.pageSize$,
    this.pageIndex$,
    this.flush$,
    this.checkBoxValue$,
  ]).pipe(
    switchMap(([pageSize, pageIndex, , types]) => {
      this.loading$.next(true);
      return this.faDbService.getAllFaData$().pipe(
        map((data) => {
          const typesMap = new Set(types);
          return data.filter((fa) => typesMap.has(fa.type));
        }),
        tap((data) => {
          this.total$.next(data.length);
          this.loading$.next(false);
        }),
        map((data) => {
          return data.slice((pageIndex - 1) * pageSize, pageSize * pageIndex);
        }),
      );
    }),
  );
  onDel(digest: string) {
    const id = this.message.loading('删除中…', {
      nzDuration: 0,
    }).messageId;
    this.faDbService.removeFaData$(digest).subscribe(() => {
      this.message.remove(id);
      this.message.success('删除成功！');
      this.flush$.next(true);
    });
  }
}
