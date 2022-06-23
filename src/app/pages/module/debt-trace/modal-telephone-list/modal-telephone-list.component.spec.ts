import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalTelephoneListComponent } from './modal-telephone-list.component';

describe('ModalTelephoneListComponent', () => {
  let component: ModalTelephoneListComponent;
  let fixture: ComponentFixture<ModalTelephoneListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalTelephoneListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalTelephoneListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
