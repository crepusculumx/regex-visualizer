import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NfaInputComponent } from './nfa-input.component';

describe('NfaInputComponent', () => {
  let component: NfaInputComponent;
  let fixture: ComponentFixture<NfaInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NfaInputComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NfaInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
