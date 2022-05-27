import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalTraceWorkComponent } from './modal-trace-work.component';

describe('ModalTraceWorkComponent', () => {
  let component: ModalTraceWorkComponent;
  let fixture: ComponentFixture<ModalTraceWorkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalTraceWorkComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalTraceWorkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
