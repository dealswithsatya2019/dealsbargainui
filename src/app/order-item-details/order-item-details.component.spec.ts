import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderItemDetailsComponent } from './order-item-details.component';

describe('OrderItemDetailsComponent', () => {
  let component: OrderItemDetailsComponent;
  let fixture: ComponentFixture<OrderItemDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderItemDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderItemDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
