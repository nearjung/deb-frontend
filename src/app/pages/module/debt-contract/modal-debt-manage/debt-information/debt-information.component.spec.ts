import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DebtInformationComponent } from './debt-information.component';

describe('DebtInformationComponent', () => {
  let component: DebtInformationComponent;
  let fixture: ComponentFixture<DebtInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DebtInformationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DebtInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
