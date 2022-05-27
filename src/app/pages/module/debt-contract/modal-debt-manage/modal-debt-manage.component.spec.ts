import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDebtManageComponent } from './modal-debt-manage.component';

describe('ModalDebtManageComponent', () => {
  let component: ModalDebtManageComponent;
  let fixture: ComponentFixture<ModalDebtManageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalDebtManageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalDebtManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
