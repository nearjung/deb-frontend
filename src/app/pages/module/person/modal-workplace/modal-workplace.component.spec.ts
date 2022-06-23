import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalWorkplaceComponent } from './modal-workplace.component';

describe('ModalWorkplaceComponent', () => {
  let component: ModalWorkplaceComponent;
  let fixture: ComponentFixture<ModalWorkplaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalWorkplaceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalWorkplaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
