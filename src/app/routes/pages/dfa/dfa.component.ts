import { Component, inject } from '@angular/core';
import { delay, map, Observable, ReplaySubject, shareReplay } from 'rxjs';
import {
  FaInputArgs,
  FaInputComponent,
} from '../../fa-input/fa-input.component';
import { ActivatedRoute, Router } from '@angular/router';
import { FaType } from '../../../services/fa-db.service';
import { AsyncPipe } from '@angular/common';
import { FlatDfa, toG6GraphData } from '../../../regex-fa/dfa';
import { FaGraphComponent } from '../../fa-graph/fa-graph.component';

@Component({
  selector: 'app-dfa',
  imports: [AsyncPipe, FaInputComponent, FaGraphComponent],
  templateUrl: './dfa.component.html',
  styleUrl: './dfa.component.less',
})
export class DfaComponent {
  protected readonly route = inject(ActivatedRoute);
  readonly router = inject(Router);

  private readonly digest$ = this.route.paramMap.pipe(
    map((params) => {
      return params.get('digest');
    }),
    shareReplay(1),
  );

  readonly faInputArgs$: Observable<FaInputArgs> = this.digest$.pipe(
    map((digest): FaInputArgs => {
      return { faDigest: digest ? digest : undefined, faType: FaType.DFA };
    }),
    shareReplay(1),
  );

  readonly dfa$ = new ReplaySubject<FlatDfa>();

  readonly dfaG6$ = this.dfa$.pipe(
    delay(1), //NG0100: ExpressionChangedAfterItHasBeenCheckedError
    map(toG6GraphData),
    shareReplay(1),
  );
  protected readonly FaType = FaType;
}
