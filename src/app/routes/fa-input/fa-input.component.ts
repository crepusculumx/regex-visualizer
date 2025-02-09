import {
  Component,
  DestroyRef,
  inject,
  input,
  Pipe,
  PipeTransform,
} from '@angular/core';
import { NzCardModule } from 'ng-zorro-antd/card';
import {
  BehaviorSubject,
  concatMap,
  Observable,
  of,
  ReplaySubject,
  shareReplay,
  tap,
  withLatestFrom,
} from 'rxjs';
import { DfaInputComponent } from './dfa-input/dfa-input.component';
import { NzFormModule } from 'ng-zorro-antd/form';
import { FormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { AsyncPipe } from '@angular/common';
import { FaData, FaDbService, FaType } from '../../services/fa-db.service';
import {
  outputFromObservable,
  takeUntilDestroyed,
  toObservable,
} from '@angular/core/rxjs-interop';
import { FlatFa } from '../../regex-fa/regex-fa';
import {
  addPre,
  filterNull,
  nullMap,
  nullSwitchMap,
} from '../../tools/rxjs-tool';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NfaInputComponent } from './nfa-input/nfa-input.component';
import { FlatDfa } from '../../regex-fa/dfa';
import { FlatNfa } from '../../regex-fa/nfa';

export interface FaInputArgs {
  faType: FaType;
  faDigest?: string;
}

interface FaInputParams {
  faData: FaData;
  fa: FlatFa;
}

@Pipe({ name: 'asDfa' })
class AsDfaPipe implements PipeTransform {
  transform(value: FlatFa) {
    return value as FlatDfa;
  }
}

@Pipe({ name: 'asNfa' })
class AsNfaPipe implements PipeTransform {
  transform(value: FlatFa) {
    return value as FlatNfa;
  }
}

@Component({
  selector: 'app-fa-input',
  imports: [
    NzCardModule,
    DfaInputComponent,
    NzFormModule,
    FormsModule,
    NzInputModule,
    NzButtonModule,
    AsyncPipe,
    NzPageHeaderModule,
    NfaInputComponent,
    AsDfaPipe,
    AsNfaPipe,
  ],
  templateUrl: './fa-input.component.html',
  styleUrl: './fa-input.component.less',
})
export class FaInputComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly faDbService = inject(FaDbService);
  private readonly message = inject(NzMessageService);

  readonly faInputArgs = input.required<FaInputArgs>();
  readonly faInputArgs$: Observable<FaInputArgs | null> = toObservable(
    this.faInputArgs,
  ).pipe(addPre(null), shareReplay(1));

  readonly faInputParams$ = this.faInputArgs$.pipe(
    nullSwitchMap((args) => {
      if (args.faDigest === undefined) {
        return of(null);
      }
      return this.faDbService.getFaData$(args.faDigest);
    }),
    nullMap((faData): FaInputParams => {
      return { fa: JSON.parse(faData.data), faData };
    }),
    shareReplay(1),
  );

  readonly fa$ = new ReplaySubject<FlatFa>(1);

  readonly formName$ = new BehaviorSubject<string>('');
  readonly update$ = new ReplaySubject<boolean>();
  readonly add$ = new ReplaySubject<boolean>();
  readonly buttonLoading$ = new BehaviorSubject<boolean>(false);

  readonly digestChange$ = new ReplaySubject<string>();

  // noinspection JSUnusedLocalSymbols
  private readonly updateSub = this.update$
    .pipe(
      withLatestFrom(
        this.formName$,
        this.faInputArgs$.pipe(filterNull()),
        this.fa$,
      ),
      concatMap(([, name, faInputArgs, fa]) => {
        const id = this.message.loading('更新中…', {
          nzDuration: 0,
        }).messageId;
        this.buttonLoading$.next(true);

        return this.faDbService
          .updateFaData$(
            faInputArgs.faDigest!,
            name === '' ? '未命名模型' : name,
            faInputArgs.faType,
            fa,
          )
          .pipe(
            tap(() => {
              this.message.remove(id);
              this.message.success('更新完成！');
              this.buttonLoading$.next(false);
            }),
          );
      }),
      takeUntilDestroyed(this.destroyRef),
    )
    .subscribe((digest) => {
      this.digestChange$.next(digest);
    });

  // noinspection JSUnusedLocalSymbols
  private readonly addSub = this.add$
    .pipe(
      withLatestFrom(
        this.formName$,
        this.faInputArgs$.pipe(filterNull()),
        this.fa$,
      ),
      concatMap(([, name, faInputArgs, fa]) => {
        const id = this.message.loading('添加中…', {
          nzDuration: 0,
        }).messageId;
        this.buttonLoading$.next(true);

        return this.faDbService
          .addFaData$(name === '' ? '未命名模型' : name, faInputArgs.faType, fa)
          .pipe(
            tap(() => {
              this.message.remove(id);
              this.message.success('添加完成！');
              this.buttonLoading$.next(false);
            }),
          );
      }),
      takeUntilDestroyed(this.destroyRef),
    )
    .subscribe((digest) => {
      this.digestChange$.next(digest);
    });

  readonly faChange = outputFromObservable(this.fa$);
  readonly dfaChange = outputFromObservable(this.fa$ as Observable<FlatDfa>);
  readonly nfaChange = outputFromObservable(this.fa$ as Observable<FlatNfa>);

  readonly digitChange = outputFromObservable(this.digestChange$);
  protected readonly FaType = FaType;
}
