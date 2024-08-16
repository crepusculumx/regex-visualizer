import {
  AfterViewInit,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { combineLatest, Observable, ReplaySubject } from 'rxjs';
import { Graph, GraphData } from '@antv/g6';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NzCardModule } from 'ng-zorro-antd/card';

@Component({
  selector: 'app-fa-graph',
  standalone: true,
  imports: [NzCardModule],
  templateUrl: './fa-graph.component.html',
  styleUrl: './fa-graph.component.less',
})
export class FaGraphComponent implements OnInit, AfterViewInit {
  destroyRef = inject(DestroyRef);

  @Input({ required: true }) data$!: Observable<GraphData>;

  @ViewChild('container') container!: ElementRef;

  graph$ = new ReplaySubject<Graph>(1);

  ngOnInit() {
    combineLatest([this.graph$, this.data$])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(([graph, data]) => {
        graph.setData(data);
        graph.render();
      });
  }

  ngAfterViewInit() {
    const container = this.container.nativeElement;
    const width = container!.width;
    const height = 500;
    const graph = new Graph({
      container: this.container.nativeElement,
      width,
      height,
      autoResize: true,
      autoFit: 'view',
      padding: 10,
      node: {},
      edge: {
        style: {
          labelBackground: true,
          endArrow: true,
          labelText: (d) => d['label'] as string,
        },
      },
      layout: {
        type: 'antv-dagre',
        align: 'UR',
      },
      behaviors: ['drag-element', 'drag-canvas', 'zoom-canvas'],
      transforms: ['process-parallel-edges'],
      plugins: [
        {
          type: 'toolbar',
          key: 'toolbar',
          position: 'top-left',
          onClick: (item: string) => {
            switch (item) {
              case 'reset':
                graph.render();
            }
          },
          getItems: () => {
            // G6 内置了 9 个 icon，分别是 zoom-in、zoom-out、redo、undo、edit、delete、auto-fit、export、reset
            return [
              // { id: 'zoom-in', value: 'zoom-in' },
              // { id: 'zoom-out', value: 'zoom-out' },
              // { id: 'redo', value: 'redo' },
              // { id: 'undo', value: 'undo' },
              // { id: 'edit', value: 'edit' },
              // { id: 'delete', value: 'delete' },
              // { id: 'auto-fit', value: 'auto-fit' },
              // { id: 'export', value: 'export' },
              { id: 'reset', value: 'reset' },
            ];
          },
        },
      ],
    });
    graph.render().then();
    this.graph$.next(graph);
  }
}
