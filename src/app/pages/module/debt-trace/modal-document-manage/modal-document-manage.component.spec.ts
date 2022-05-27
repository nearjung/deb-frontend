import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDocumentManageComponent } from './modal-document-manage.component';

describe('ModalDocumentManageComponent', () => {
  let component: ModalDocumentManageComponent;
  let fixture: ComponentFixture<ModalDocumentManageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalDocumentManageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalDocumentManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
