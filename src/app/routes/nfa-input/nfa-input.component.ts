import { Component, Output } from '@angular/core';
import { NzCardComponent } from 'ng-zorro-antd/card';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { FormsModule } from '@angular/forms';
import {
  BehaviorSubject,
  combineLatest,
  distinctUntilChanged,
  filter,
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
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { checkFlatNfa, FlatNfa } from '../../regex-fa/nfa';
import { StatesInputComponent } from '../states-input/states-input.component';

interface tableRowParam {
  stateId: StateId;
  isS: boolean;
  isF: boolean;
  transTable: (number[] | null)[];
}

interface tableParams {
  statesSize: number;
  terminalsSize: number;
  terminals: (Terminal | null)[];
  rows: tableRowParam[];
}

interface tableRowParamInputs {
  stateId$: BehaviorSubject<StateId>;
  isS$: Observable<boolean>;
  isF$: BehaviorSubject<boolean>;
  transTable: BehaviorSubject<number[] | null>[];
}

interface tableInputs {
  statesSize: number;
  terminalsSize: number;
  terminals: BehaviorSubject<Terminal | null>[];
  rows: tableRowParamInputs[];
  s$: BehaviorSubject<number>;
}

@Component({
  selector: 'app-nfa-input',
  imports: [
    NzCardComponent,
    NzInputModule,
    NzInputNumberModule,
    NzCheckboxModule,
    NzSpaceModule,
    NzTableModule,
    FormsModule,
    AsyncPipe,
    NzRadioModule,
    StatesInputComponent,
  ],
  templateUrl: './nfa-input.component.html',
  styleUrl: './nfa-input.component.less',
})
export class NfaInputComponent {
  // When the number of rows changes, retain the filled in content.
  private tableParams: tableParams = {
    rows: [],
    statesSize: 1,
    terminalsSize: 1,
    terminals: [],
  };

  statesSize$ = new BehaviorSubject<number>(1);
  terminalsSize$ = new BehaviorSubject<number>(1);

  tableInputs$: Observable<tableInputs> = combineLatest([
    this.statesSize$,
    this.terminalsSize$,
  ]).pipe(
    // Resize this.tableParams
    tap(([statesSize, terminalsSize]) => {
      this.tableParams.statesSize = statesSize;
      this.tableParams.terminalsSize = terminalsSize;
      while (this.tableParams.rows.length > statesSize) {
        this.tableParams.rows.pop();
      }
      while (this.tableParams.terminals.length > terminalsSize) {
        this.tableParams.terminals.pop();
      }
    }),
    // Build new tableInputs
    map(([statesSize, terminalsSize]) => {
      const res: tableInputs = {
        statesSize: statesSize,
        terminalsSize: terminalsSize,
        rows: [],
        terminals: [],
        s$: new BehaviorSubject(0),
      };

      for (let i = 0; i < terminalsSize; i++) {
        res.terminals.push(
          new BehaviorSubject(
            this.tableParams.terminals.length > i
              ? this.tableParams.terminals[i]
              : null,
          ),
        );
      }

      for (let i = 0; i < statesSize; i++) {
        const rowInput: tableRowParamInputs = {
          isF$: new BehaviorSubject<boolean>(
            this.tableParams.rows.length > i
              ? this.tableParams.rows[i].isF
              : false,
          ),
          isS$: res.s$.pipe(
            map((s) => {
              return s == i;
            }),
          ),
          stateId$: new BehaviorSubject<StateId>(i),
          transTable: [],
        };

        for (let j = 0; j < terminalsSize; j++) {
          rowInput.transTable.push(
            new BehaviorSubject<number[] | null>(
              this.tableParams.rows.length > i &&
              this.tableParams.rows[i].transTable.length > j
                ? this.tableParams.rows[i].transTable[j]!
                : null,
            ),
          );
        }
        res.rows.push(rowInput);
      }
      return res;
    }),
    shareReplay(1),
  );

  tableParams$ = this.tableInputs$.pipe(
    switchMap((tableInputs) => {
      const terminals$ = combineLatest<(string | null)[]>(
        tableInputs.terminals,
      ).pipe(distinctUntilChanged(), shareReplay(1));
      const rows$ = combineLatest(
        tableInputs.rows.map((tableRowParamInputs) => {
          return combineLatest([
            tableRowParamInputs.stateId$,
            tableRowParamInputs.isS$,
            tableRowParamInputs.isF$,
            combineLatest(tableRowParamInputs.transTable).pipe(
              distinctUntilChanged(),
              shareReplay(1),
            ),
          ]).pipe(
            map(([stateId, isS, isF, transTable]): tableRowParam => {
              return {
                isF,
                isS,
                stateId,
                transTable,
              };
            }),
            distinctUntilChanged(),
            shareReplay(1),
          );
        }),
      );

      return combineLatest([terminals$, rows$]).pipe(
        map(([terminals, rows]): tableParams => {
          return {
            rows: rows,
            statesSize: tableInputs.statesSize,
            terminals: terminals,
            terminalsSize: tableInputs.terminalsSize,
          };
        }),
        distinctUntilChanged(),
        shareReplay(1),
      );
    }),
    tap((nfaTableParams) => {
      this.tableParams = nfaTableParams;
    }),
    distinctUntilChanged(),
    shareReplay(1),
  );

  flatNfa$: Observable<FlatNfa> = this.tableParams$.pipe(
    map((nfaTableParams) => {
      const res: FlatNfa = {
        states: [],
        flatEdges: [],
        f: [],
        s: -1,
      };
      for (const row of nfaTableParams.rows) {
        res.states.push(row.stateId);
        if (row.isS) {
          res.s = row.stateId;
        }
        if (row.isF) {
          res.f.push(row.stateId);
        }
        for (let i = 0; i < row.transTable.length; i++) {
          if (
            row.transTable[i] !== null &&
            row.transTable[i] !== undefined &&
            nfaTableParams.terminals[i] !== null &&
            nfaTableParams.terminals[i] !== ''
          ) {
            for (const v of row.transTable[i]!) {
              res.flatEdges.push({
                source: row.stateId,
                target: v,
                terminal: nfaTableParams.terminals[i]!,
              });
            }
          }
        }
      }
      if (res.s === -1) {
        res.s = res.states[0];
      }
      return res;
    }),
    filter(checkFlatNfa),
    distinctUntilChanged(),
    shareReplay(1),
  );

  @Output() nfaChange = this.flatNfa$;
}
