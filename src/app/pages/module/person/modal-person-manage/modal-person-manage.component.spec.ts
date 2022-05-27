import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPersonManageComponent } from './modal-person-manage.component';

describe('ModalPersonManageComponent', () => {
  let component: ModalPersonManageComponent;
  let fixture: ComponentFixture<ModalPersonManageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalPersonManageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalPersonManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
