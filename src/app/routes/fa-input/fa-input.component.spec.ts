import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaInputComponent } from './fa-input.component';

describe('FaInputComponent', () => {
  let component: FaInputComponent;
  let fixture: ComponentFixture<FaInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FaInputComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FaInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
