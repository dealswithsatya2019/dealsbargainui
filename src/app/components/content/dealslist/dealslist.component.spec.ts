import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DealslistComponent } from './dealslist.component';

describe('DealslistComponent', () => {
  let component: DealslistComponent;
  let fixture: ComponentFixture<DealslistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DealslistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DealslistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
