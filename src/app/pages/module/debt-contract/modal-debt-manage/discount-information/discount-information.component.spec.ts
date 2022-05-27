import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscountInformationComponent } from './discount-information.component';

describe('DiscountInformationComponent', () => {
  let component: DiscountInformationComponent;
  let fixture: ComponentFixture<DiscountInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiscountInformationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscountInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
