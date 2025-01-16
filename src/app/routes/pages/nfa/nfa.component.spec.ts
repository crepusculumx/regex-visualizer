import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NfaComponent } from './nfa.component';

describe('NfaComponent', () => {
  let component: NfaComponent;
  let fixture: ComponentFixture<NfaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NfaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NfaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
