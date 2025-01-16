import { Component, Input, OnInit, Output } from '@angular/core';
import { NzInputDirective, NzInputGroupComponent } from 'ng-zorro-antd/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject, map, timer } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-states-input',
  imports: [
    NzInputDirective,
    NzInputGroupComponent,
    ReactiveFormsModule,
    FormsModule,
    AsyncPipe,
  ],
  templateUrl: './states-input.component.html',
  styleUrl: './states-input.component.less',
})
export class StatesInputComponent implements OnInit {
  @Input() states: number[] = [];
  @Input({ required: true }) maxId = 0;

  arrayToCommaSeparatedString(numbers: number[]): string {
    numbers = [...new Set(numbers)];
    return numbers.sort().join(', ');
  }

  // 将逗号分隔的字符串转换为 number 数组
  commaSeparatedStringToArray(input: string): number[] {
    return input
      .split(',')
      .map((num) => parseInt(num.trim()))
      .filter((num) => !isNaN(num))
      .filter((num) => num < this.maxId);
  }

  statesStr$ = new BehaviorSubject<string>('');
  onStatesChange(input: string) {
    //通过timer(1)延迟到下一个变更检测周期
    // 否则会出现:
    // 1. 输入框内:1, model=1
    // 2. 输入框内:1a, 因为目标去除非数字和逗号, model被设置为1
    // 3. angular变更检测认为model没变,view不变,输入框内仍然是1a,而model=1,发生model和view不同步的问题
    // 因此先在当前变更检测周期内,将view和model同步,然后在下一次变更检测更新为目标内容
    this.statesStr$.next(input);
    const res = input.replace(/[^0-9, ]/g, '');
    if (input != res) {
      timer(1).subscribe(() => {
        this.statesStr$.next(res);
      });
    }
  }

  onBlur() {
    const states = this.commaSeparatedStringToArray(this.statesStr$.value);
    this.statesStr$.next(this.arrayToCommaSeparatedString(states));
  }

  @Output() statesChange = this.statesStr$.pipe(
    map((input) => {
      return this.commaSeparatedStringToArray(input);
    }),
  );

  ngOnInit() {
    this.statesStr$.next(this.arrayToCommaSeparatedString(this.states));
  }
}
