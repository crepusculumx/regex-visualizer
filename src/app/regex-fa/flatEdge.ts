import { StateId, Terminal } from './regex-fa';

export interface FlatEdge {
  source: StateId;
  target: StateId;
  terminal: Terminal;
}

export type FlatEdges = FlatEdge[];
