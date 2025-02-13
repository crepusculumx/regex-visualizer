import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaListComponent } from './fa-list.component';

describe('FaListComponent', () => {
  let component: FaListComponent;
  let fixture: ComponentFixture<FaListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FaListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
