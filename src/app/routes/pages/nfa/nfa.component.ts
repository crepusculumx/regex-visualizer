import { Component } from '@angular/core';
import { NfaInputComponent } from '../../nfa-input/nfa-input.component';
import { map, ReplaySubject } from 'rxjs';
import { FlatNfa, nfaToG6GraphData } from '../../../regex-fa/nfa';
import { FaGraphComponent } from '../../fa-graph/fa-graph.component';

@Component({
  selector: 'app-nfa',
  imports: [NfaInputComponent, FaGraphComponent],
  templateUrl: './nfa.component.html',
  styleUrl: './nfa.component.less',
})
export class NfaComponent {
  flatNfa$ = new ReplaySubject<FlatNfa>(1);

  G6Graph$ = this.flatNfa$.pipe(
    map((flatNfa) => {
      return nfaToG6GraphData(flatNfa);
    }),
  );
}
