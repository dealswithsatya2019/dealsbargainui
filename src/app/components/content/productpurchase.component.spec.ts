import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductpurchaseComponent } from './productpurchase.component';

describe('ProductpurchaseComponent', () => {
  let component: ProductpurchaseComponent;
  let fixture: ComponentFixture<ProductpurchaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductpurchaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductpurchaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
