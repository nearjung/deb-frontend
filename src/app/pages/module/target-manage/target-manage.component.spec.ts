import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TargetManageComponent } from './target-manage.component';

describe('TargetManageComponent', () => {
  let component: TargetManageComponent;
  let fixture: ComponentFixture<TargetManageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TargetManageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TargetManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
