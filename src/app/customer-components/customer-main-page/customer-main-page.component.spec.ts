import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerMainPageComponent } from './customer-main-page.component';

describe('CustomerMainPageComponent', () => {
  let component: CustomerMainPageComponent;
  let fixture: ComponentFixture<CustomerMainPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerMainPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
