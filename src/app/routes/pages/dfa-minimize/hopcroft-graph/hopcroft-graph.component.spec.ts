import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HopcroftGraphComponent } from './hopcroft-graph.component';

describe('HopcroftGraphComponent', () => {
  let component: HopcroftGraphComponent;
  let fixture: ComponentFixture<HopcroftGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HopcroftGraphComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HopcroftGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
