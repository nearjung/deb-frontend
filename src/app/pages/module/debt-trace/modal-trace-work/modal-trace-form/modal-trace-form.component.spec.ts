import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalTraceFormComponent } from './modal-trace-form.component';

describe('ModalTraceFormComponent', () => {
  let component: ModalTraceFormComponent;
  let fixture: ComponentFixture<ModalTraceFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalTraceFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalTraceFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
