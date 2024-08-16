import { Component } from '@angular/core';
import { DfaInputComponent } from '../../dfa-input/dfa-input.component';
import { FaGraphComponent } from '../../fa-graph/fa-graph.component';
import { map, ReplaySubject } from 'rxjs';
import { FlatDfa, toG6GraphData } from '../../../regex-fa/dfa';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-dfa',
  standalone: true,
  imports: [DfaInputComponent, FaGraphComponent, AsyncPipe],
  templateUrl: './dfa.component.html',
  styleUrl: './dfa.component.less',
})
export class DfaComponent {
  flatDfa$ = new ReplaySubject<FlatDfa>(1);

  G6Graph$ = this.flatDfa$.pipe(
    map((flatDfa) => {
      return toG6GraphData(flatDfa);
    }),
  );
}
