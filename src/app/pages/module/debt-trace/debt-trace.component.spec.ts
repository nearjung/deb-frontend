import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DebtTraceComponent } from './debt-trace.component';

describe('DebtTraceComponent', () => {
  let component: DebtTraceComponent;
  let fixture: ComponentFixture<DebtTraceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DebtTraceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DebtTraceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
