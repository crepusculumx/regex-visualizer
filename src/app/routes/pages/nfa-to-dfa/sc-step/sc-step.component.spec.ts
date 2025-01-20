import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScStepComponent } from './sc-step.component';

describe('ScStepComponent', () => {
  let component: ScStepComponent;
  let fixture: ComponentFixture<ScStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScStepComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ScStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
