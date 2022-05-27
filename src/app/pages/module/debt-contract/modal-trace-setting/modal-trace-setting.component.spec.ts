import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalTraceSettingComponent } from './modal-trace-setting.component';

describe('ModalTraceSettingComponent', () => {
  let component: ModalTraceSettingComponent;
  let fixture: ComponentFixture<ModalTraceSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalTraceSettingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalTraceSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
