import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCustomerRelationComponent } from './modal-customer-relation.component';

describe('ModalCustomerRelationComponent', () => {
  let component: ModalCustomerRelationComponent;
  let fixture: ComponentFixture<ModalCustomerRelationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalCustomerRelationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCustomerRelationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
