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
