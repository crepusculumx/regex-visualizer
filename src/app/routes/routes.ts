import { Route } from '@angular/router';

import { BasicLayoutComponent } from '../layout/basic-layout/basic-layout.component';
import { DfaComponent } from './pages/dfa/dfa.component';
import { DfaMinimizeComponent } from './pages/dfa-minimize/dfa-minimize.component';
import { NfaComponent } from './pages/nfa/nfa.component';
import { NfaToDfaComponent } from './pages/nfa-to-dfa/nfa-to-dfa.component';

export default [
  {
    path: '',
    component: BasicLayoutComponent,
    children: [
      {
        path: 'dfa',
        component: DfaComponent,
      },
      {
        path: 'nfa',
        component: NfaComponent,
      },
      {
        path: 'dfa-minimize',
        component: DfaMinimizeComponent,
      },
      {
        path: 'nfa-to-dfa',
        component: NfaToDfaComponent,
      },
    ],
  },
] as Route[];
