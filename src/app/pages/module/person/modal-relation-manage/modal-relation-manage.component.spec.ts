import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalRelationManageComponent } from './modal-relation-manage.component';

describe('ModalRelationManageComponent', () => {
  let component: ModalRelationManageComponent;
  let fixture: ComponentFixture<ModalRelationManageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalRelationManageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalRelationManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
