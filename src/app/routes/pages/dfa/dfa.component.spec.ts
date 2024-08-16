import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DfaComponent } from './dfa.component';

describe('DfaComponent', () => {
  let component: DfaComponent;
  let fixture: ComponentFixture<DfaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DfaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DfaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
