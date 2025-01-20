import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaTableComponent } from './fa-table.component';

describe('FaTableComponent', () => {
  let component: FaTableComponent;
  let fixture: ComponentFixture<FaTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FaTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FaTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
