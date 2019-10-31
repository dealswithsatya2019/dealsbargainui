import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RateproductComponent } from './rateproduct.component';

describe('RateproductComponent', () => {
  let component: RateproductComponent;
  let fixture: ComponentFixture<RateproductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RateproductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RateproductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
