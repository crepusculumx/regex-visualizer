import { Component, inject } from '@angular/core';
import { delay, map, Observable, ReplaySubject, shareReplay } from 'rxjs';
import { FlatNfa, nfaToG6GraphData } from '../../../regex-fa/nfa';
import { FaGraphComponent } from '../../fa-graph/fa-graph.component';
import { AsyncPipe } from '@angular/common';
import {
  FaInputArgs,
  FaInputComponent,
} from '../../fa-input/fa-input.component';
import { ActivatedRoute } from '@angular/router';
import { FaType } from '../../../services/fa-db.service';

@Component({
  selector: 'app-nfa',
  imports: [FaGraphComponent, AsyncPipe, FaInputComponent],
  templateUrl: './nfa.component.html',
  styleUrl: './nfa.component.less',
})
export class NfaComponent {
  private readonly route = inject(ActivatedRoute);

  private readonly digest$ = this.route.paramMap.pipe(
    map((params) => {
      return params.get('digest');
    }),
    shareReplay(1),
  );

  readonly faInputArgs$: Observable<FaInputArgs> = this.digest$.pipe(
    map((digest): FaInputArgs => {
      return { faDigest: digest ? digest : undefined, faType: FaType.NFA };
    }),
    shareReplay(1),
  );

  readonly nfa$ = new ReplaySubject<FlatNfa>();

  readonly dfaG6$ = this.nfa$.pipe(
    delay(1), //NG0100: ExpressionChangedAfterItHasBeenCheckedError
    map(nfaToG6GraphData),
    shareReplay(1),
  );
}
