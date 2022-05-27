import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LawsuitInformationComponent } from './lawsuit-information.component';

describe('LawsuitInformationComponent', () => {
  let component: LawsuitInformationComponent;
  let fixture: ComponentFixture<LawsuitInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LawsuitInformationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LawsuitInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
