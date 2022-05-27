import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DebtContractComponent } from './debt-contract.component';

describe('DebtContractComponent', () => {
  let component: DebtContractComponent;
  let fixture: ComponentFixture<DebtContractComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DebtContractComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DebtContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
