import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DfaMinimizeComponent } from './dfa-minimize.component';

describe('DfaMinimizeComponent', () => {
  let component: DfaMinimizeComponent;
  let fixture: ComponentFixture<DfaMinimizeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DfaMinimizeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DfaMinimizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
