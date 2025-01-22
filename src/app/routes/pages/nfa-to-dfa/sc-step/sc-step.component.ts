import { Component, input } from '@angular/core';
import { FlatNfa, ScLog, ScStep } from '../../../../regex-fa/nfa';
import {
  BehaviorSubject,
  combineLatest,
  map,
  Observable,
  shareReplay,
  tap,
} from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { toObservable } from '@angular/core/rxjs-interop';
import { addPre } from '../../../../rxjs-tool/rxjs-tool';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { FormsModule } from '@angular/forms';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { Terminal } from '../../../../regex-fa/regex-fa';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';

export interface ScStepParams {
  flatNfa: FlatNfa;
  scLog: ScLog;
}

interface TableRowParam {
  state: string;
  isS: boolean;
  isF: boolean;
  transTable: string[];
}

interface TableParams {
  statesSize: number;
  terminalsSize: number;
  terminals: Terminal[];
  rows: TableRowParam[];
}

@Component({
  selector: 'app-sc-step',
  imports: [
    AsyncPipe,
    NzSliderModule,
    FormsModule,
    NzTypographyModule,
    NzTableModule,
    NzRadioModule,
    NzCheckboxModule,
  ],
  templateUrl: './sc-step.component.html',
  styleUrl: './sc-step.component.less',
})
export class ScStepComponent {
  p$ = new BehaviorSubject<number>(1);

  scStepParams = input.required<ScStepParams>();
  scStepParams$: Observable<ScStepParams | null> = toObservable(
    this.scStepParams,
  ).pipe(
    addPre(null),
    tap(() => {
      this.p$.next(1);
    }),
    shareReplay(1),
  );

  scStep$: Observable<ScStep | null> = combineLatest([
    this.scStepParams$,
    this.p$,
  ]).pipe(
    map(([scStepParams, p]) => {
      if (scStepParams === null) {
        return null;
      }
      if (scStepParams.scLog.steps.length <= p - 1) {
        return null;
      }
      return scStepParams.scLog.steps[p - 1];
    }),
    shareReplay(1),
  );

  tableParams$: Observable<TableParams | null> = combineLatest([
    this.scStepParams$,
    this.p$,
  ]).pipe(
    map(([scStepParams, p]) => {
      if (scStepParams === null) {
        return null;
      }
      if (scStepParams.scLog.steps.length <= p - 1) {
        return null;
      }

      const steps = scStepParams.scLog.steps.slice(0, p).map((step) => {
        step.curSubset.sort();
        return step;
      });

      steps.sort((a, b) => {
        if (a.curSubset.length < b.curSubset.length) {
          return -1;
        } else if (a.curSubset.length > b.curSubset.length) {
          return 1;
        }
        for (let i = 0; i < a.curSubset.length; i++) {
          if (a.curSubset[i] < b.curSubset[i]) return -1;
          if (a.curSubset[i] > b.curSubset[i]) return 1;
        }
        return 0;
      });

      const res: TableParams = {
        rows: [],
        statesSize: steps.length,
        terminals: [
          ...new Set(
            scStepParams.flatNfa.flatEdges.map((edge) => {
              return edge.terminal;
            }),
          ),
        ].sort(),
        terminalsSize: 0,
      };
      res.terminalsSize = res.terminals.length;
      res.rows = steps.map((step) => {
        return {
          isF: step.curSubset.some((element) =>
            scStepParams.flatNfa.f.includes(element),
          ),
          isS:
            step.curSubset.length === 1 &&
            step.curSubset.includes(scStepParams.flatNfa.s),
          state: `[ ${step.curSubset.join('. ')} ]`,
          transTable: res.terminals.map((terminal): string => {
            const edge = step.scEdges.find(
              (edge) => edge.terminal === terminal,
            );
            if (edge === undefined) {
              return '';
            } else {
              return `[ ${edge.target.sort().join(', ')} ]`;
            }
          }),
        };
      });
      return res;
    }),
    shareReplay(1),
  );
}
