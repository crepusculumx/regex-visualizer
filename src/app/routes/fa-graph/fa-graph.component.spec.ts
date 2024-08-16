import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaGraphComponent } from './fa-graph.component';

describe('FaGraphComponent', () => {
  let component: FaGraphComponent;
  let fixture: ComponentFixture<FaGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FaGraphComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FaGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
