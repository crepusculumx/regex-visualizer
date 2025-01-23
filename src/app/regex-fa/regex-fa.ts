import { FlatDfa } from './dfa';
import { FlatNfa } from './nfa';

export type StateId = number;

export type Terminal = string;

export type States = Set<StateId>;

export interface FlatEdge {
  source: StateId;
  target: StateId;
  terminal: Terminal;
}

export type FlatEdges = FlatEdge[];

export type FlatStates = StateId[];

export type FlatEpsilonNfa = string; // temp

export type FlatFa = FlatDfa | FlatNfa | FlatEpsilonNfa;
