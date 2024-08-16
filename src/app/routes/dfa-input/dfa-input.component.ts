import { Component, Output } from '@angular/core';
import { NzCardComponent } from 'ng-zorro-antd/card';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { FormsModule } from '@angular/forms';
import {
  BehaviorSubject,
  combineLatest,
  map,
  Observable,
  shareReplay,
  switchMap,
  tap,
} from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';

import { StateId, Terminal } from '../../regex-fa/regex-fa';
import { FlatDfa } from '../../regex-fa/dfa';

interface DfaTableRowParam {
  stateId: StateId;
  isS: boolean;
  isF: boolean;
  transTable: (number | null)[];
}

interface DfaTableParams {
  statesSize: number;
  terminalsSize: number;
  terminals: (Terminal | null)[];
  rows: DfaTableRowParam[];
}

interface DfaTableRowParamInputs {
  stateId$: BehaviorSubject<StateId>;
  isS$: BehaviorSubject<boolean>;
  isF$: BehaviorSubject<boolean>;
  transTable: BehaviorSubject<number | null>[];
}

interface DfaTableInputs {
  statesSize: number;
  terminalsSize: number;
  terminals: BehaviorSubject<Terminal | null>[];
  rows: DfaTableRowParamInputs[];
}

@Component({
  selector: 'app-dfa-input',
  standalone: true,
  imports: [
    NzCardComponent,
    NzInputModule,
    NzInputNumberModule,
    NzCheckboxModule,
    NzSpaceModule,
    NzTableModule,
    FormsModule,
    AsyncPipe,
  ],
  templateUrl: './dfa-input.component.html',
  styleUrl: './dfa-input.component.less',
})
export class DfaInputComponent {
  private dfaTableParams: DfaTableParams = {
    rows: [],
    statesSize: 1,
    terminalsSize: 1,
    terminals: [],
  };

  statesSize$ = new BehaviorSubject<number>(1);
  terminalsSize$ = new BehaviorSubject<number>(1);

  dfaTableInputs$: Observable<DfaTableInputs> = combineLatest([
    this.statesSize$,
    this.terminalsSize$,
  ]).pipe(
    tap(([statesSize, terminalsSize]) => {
      while (this.dfaTableParams.rows.length > statesSize) {
        this.dfaTableParams.rows.pop();
      }
      while (this.dfaTableParams.terminals.length > terminalsSize) {
        this.dfaTableParams.terminals.pop();
      }
    }),
    map(([statesSize, terminalsSize]) => {
      const res: DfaTableInputs = {
        statesSize: statesSize,
        terminalsSize: terminalsSize,
        rows: [],
        terminals: [],
      };

      for (let i = 0; i < terminalsSize; i++) {
        res.terminals.push(
          new BehaviorSubject(
            this.dfaTableParams.terminals.length > i
              ? this.dfaTableParams.terminals[i]
              : null,
          ),
        );
      }

      for (let i = 0; i < statesSize; i++) {
        const dfaRowInput: DfaTableRowParamInputs = {
          isF$: new BehaviorSubject<boolean>(
            this.dfaTableParams.rows.length > i
              ? this.dfaTableParams.rows[i].isF
              : false,
          ),
          isS$: new BehaviorSubject<boolean>(
            this.dfaTableParams.rows.length > i
              ? this.dfaTableParams.rows[i].isS
              : false,
          ),
          stateId$: new BehaviorSubject<StateId>(i),
          transTable: [],
        };

        for (let j = 0; j < terminalsSize; j++) {
          dfaRowInput.transTable.push(
            new BehaviorSubject<number | null>(
              this.dfaTableParams.rows.length > i &&
              this.dfaTableParams.rows[i].transTable.length > j
                ? this.dfaTableParams.rows[i].transTable[j]
                : null,
            ),
          );
        }

        res.rows.push(dfaRowInput);
      }
      return res;
    }),
    shareReplay(1),
  );

  dfaTableParams$ = this.dfaTableInputs$.pipe(
    switchMap((dfaTableInputs) => {
      const terminals$ = combineLatest<(string | null)[]>(
        dfaTableInputs.terminals,
      );
      const rows$ = combineLatest(
        dfaTableInputs.rows.map((dfaTableRowParamInputs) => {
          return combineLatest([
            dfaTableRowParamInputs.stateId$,
            dfaTableRowParamInputs.isS$,
            dfaTableRowParamInputs.isF$,
            combineLatest(dfaTableRowParamInputs.transTable),
          ]).pipe(
            map(([stateId, isS, isF, transTable]): DfaTableRowParam => {
              return { isF, isS, stateId, transTable };
            }),
          );
        }),
      );

      return combineLatest([terminals$, rows$]).pipe(
        map(([terminals, rows]): DfaTableParams => {
          return {
            rows: rows,
            statesSize: dfaTableInputs.statesSize,
            terminals: terminals,
            terminalsSize: dfaTableInputs.terminalsSize,
          };
        }),
      );
    }),
    tap((dfaTableParams) => {
      this.dfaTableParams = dfaTableParams;
    }),
    shareReplay(1),
  );

  flatDfa$: Observable<FlatDfa> = this.dfaTableParams$.pipe(
    map((dfaTableParams) => {
      const res: FlatDfa = {
        dfaTable: {
          states: [],
          flatEdges: [],
        },
        f: [],
        s: -1,
      };
      for (const row of dfaTableParams.rows) {
        res.dfaTable.states.push(row.stateId);
        if (row.isS) {
          res.s = row.stateId;
        }
        if (row.isF) {
          res.f.push(row.stateId);
        }
        for (let i = 0; i < row.transTable.length; i++) {
          if (
            typeof row.transTable[i] === 'number' && // antd bug, number-input get '' when enpty
            row.transTable[i] !== null &&
            row.transTable[i] !== undefined &&
            dfaTableParams.terminals[i] !== null &&
            dfaTableParams.terminals[i] !== ''
          ) {
            res.dfaTable.flatEdges.push({
              source: row.stateId,
              target: row.transTable[i]!,
              terminal: dfaTableParams.terminals[i]!,
            });
          }
        }
      }
      if (res.s === -1) {
        res.s = res.dfaTable.states[0];
      }

      return res;
    }),
    shareReplay(1),
  );

  @Output() dfaChange = this.flatDfa$;
}
