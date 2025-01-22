import { Component } from '@angular/core';
import { RegexFaWasmService } from '../../../services/regex-fa-wasm.service';
import {
  combineLatest,
  filter,
  from,
  map,
  Observable,
  of,
  ReplaySubject,
  shareReplay,
  switchMap,
} from 'rxjs';
import { FlatNfa, nfaToG6GraphData } from '../../../regex-fa/nfa';
import { FaGraphComponent } from '../../fa-graph/fa-graph.component';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NfaInputComponent } from '../../nfa-input/nfa-input.component';
import { ScStepComponent, ScStepParams } from './sc-step/sc-step.component';
import { AsyncPipe } from '@angular/common';
import { toG6GraphData } from '../../../regex-fa/dfa';

@Component({
  selector: 'app-nfa-to-dfa',
  imports: [
    FaGraphComponent,
    NzCollapseModule,
    NfaInputComponent,
    ScStepComponent,
    AsyncPipe,
  ],
  templateUrl: './nfa-to-dfa.component.html',
  styleUrl: './nfa-to-dfa.component.less',
})
export class NfaToDfaComponent {
  constructor(private regexService: RegexFaWasmService) {}

  inputNfa$ = new ReplaySubject<FlatNfa>(1);

  flatNfa$ = this.inputNfa$.pipe(
    switchMap((flatNfa) => {
      return from([null, flatNfa]);
    }),
    shareReplay(1),
  );

  inputNfaG6$ = this.flatNfa$.pipe(
    filter((flatNfa) => {
      return flatNfa !== null;
    }),
    map((flatNfa) => {
      return nfaToG6GraphData(flatNfa);
    }),
    shareReplay(1),
  );

  scLog$ = this.flatNfa$.pipe(
    switchMap((nfa) => {
      if (nfa === null) {
        return of(null);
      }
      return this.regexService.nfaToDfa$(nfa);
    }),
    shareReplay(1),
  );

  scStepParams$: Observable<ScStepParams | null> = combineLatest([
    this.flatNfa$,
    this.scLog$,
  ]).pipe(
    map(([flatNfa, scLog]) => {
      if (flatNfa === null || scLog === null) {
        return null;
      }
      return { flatNfa, scLog };
    }),
    shareReplay(1),
  );

  dfa$ = this.scLog$.pipe(
    map((scLog) => {
      if (scLog === null) {
        return null;
      } else {
        return scLog.target;
      }
    }),
    shareReplay(1),
  );

  dfaG6$ = this.dfa$.pipe(
    filter((data) => data !== null),
    map((flatDfa) => {
      return toG6GraphData(flatDfa);
    }),
    shareReplay(1),
  );
}
