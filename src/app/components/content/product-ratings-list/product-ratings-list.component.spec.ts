import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductRatingsListComponent } from './product-ratings-list.component';

describe('ProductRatingsListComponent', () => {
  let component: ProductRatingsListComponent;
  let fixture: ComponentFixture<ProductRatingsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductRatingsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductRatingsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
