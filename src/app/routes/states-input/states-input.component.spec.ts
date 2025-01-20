import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatesInputComponent } from './states-input.component';

describe('StatesInputComponent', () => {
  let component: StatesInputComponent;
  let fixture: ComponentFixture<StatesInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatesInputComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StatesInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
