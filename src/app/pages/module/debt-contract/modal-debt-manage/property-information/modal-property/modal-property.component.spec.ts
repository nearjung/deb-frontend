import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPropertyComponent } from './modal-property.component';

describe('ModalPropertyComponent', () => {
  let component: ModalPropertyComponent;
  let fixture: ComponentFixture<ModalPropertyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalPropertyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalPropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
