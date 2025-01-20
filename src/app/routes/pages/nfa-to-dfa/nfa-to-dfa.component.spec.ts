import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NfaToDfaComponent } from './nfa-to-dfa.component';

describe('NfaToDfaComponent', () => {
  let component: NfaToDfaComponent;
  let fixture: ComponentFixture<NfaToDfaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NfaToDfaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NfaToDfaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
