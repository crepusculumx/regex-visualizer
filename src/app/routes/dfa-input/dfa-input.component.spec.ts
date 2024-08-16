import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DfaInputComponent } from './dfa-input.component';

describe('DfaInputComponent', () => {
  let component: DfaInputComponent;
  let fixture: ComponentFixture<DfaInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DfaInputComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DfaInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
