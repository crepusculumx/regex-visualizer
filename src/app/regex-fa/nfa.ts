import { FlatStates, Terminal } from './regex-fa';
import { FlatDfa, toG6NodeId } from './dfa';
import { GraphData, NodeData } from '@antv/g6';

export type FlatNfa = FlatDfa;

/**
 * Check if nfa is legal, true for legal
 * @param flatNfa
 */
export function checkFlatNfa(flatNfa: FlatNfa): boolean {
  const states = new Set(flatNfa.states);
  function checkExistState(state: number) {
    if (!states.has(state)) {
      console.error(`checkFlatNfa: no such state ${state}`);
    }
    return states.has(state);
  }
  checkExistState(flatNfa.s);
  for (const f of flatNfa.f) {
    checkExistState(f);
  }
  for (const flatEdge of flatNfa.flatEdges) {
    checkExistState(flatEdge.source);
    checkExistState(flatEdge.target);
  }
  return true;
}

export function nfaToG6GraphData(flatNfa: FlatNfa) {
  const f = new Set<number>(flatNfa.f);

  // 当没有节点时，添加一个虚拟起点
  if (flatNfa.states.length == 0) {
    flatNfa.states.push(0);
  }

  const graphData: GraphData = {
    nodes: flatNfa.states.map((stateId) => {
      let node: NodeData = {
        id: toG6NodeId(stateId),
        label: stateId.toString(),
      };

      if (f.has(stateId)) {
        node = {
          ...node,
          ...{
            type: 'triangle',
            style: {
              size: 30,
              fill: '#EFF4FF',
              lineWidth: 1,
              stroke: '#5F95FF',
              labelPlacement: 'center',
              labelText: stateId.toString(),
            },
          },
        };
      } else {
        node = {
          ...node,
          ...{
            type: 'circle',
            style: {
              size: 30,
              fill: '#EFF4FF',
              lineWidth: 1,
              stroke: '#5F95FF',
              labelPlacement: 'center',
              labelText: stateId.toString(),
            },
          },
        };
      }
      return node;
    }),
    edges: flatNfa.flatEdges.map(({ source, target, terminal }, index) => {
      return {
        id: 'edge-' + index.toString(),
        source: 'node-' + source.toString(),
        target: 'node-' + target.toString(),
        label: terminal,
        type: source == target ? 'loop' : undefined,
      };
    }),
  };

  graphData.nodes!.push({
    id: 'node-S',
    type: 'diamond',
    style: {
      size: 30,
      fill: '#EFF4FF',
      lineWidth: 1,
      stroke: '#5F95FF',
      labelPlacement: 'center',
      labelText: 'S',
    },
  });

  graphData.edges!.push({
    id: 'edge-S',
    source: 'node-S',
    target: 'node-' + flatNfa.s.toString(),
  });

  return graphData;
}

export interface ScEdge {
  source: FlatStates;
  target: FlatStates;
  terminal: Terminal;
}

export interface ScStep {
  curSubset: FlatStates;
  scEdges: ScEdge[];
  newSubsets: FlatStates[];
  waitList: FlatStates[];
}

export interface ScTable {
  scStates: FlatStates[];
  scEdges: ScEdge[];
}

export interface ScLog {
  source: FlatNfa;
  target: FlatDfa;
  steps: ScStep[];
}
