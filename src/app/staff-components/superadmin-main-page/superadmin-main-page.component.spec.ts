import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperAdminMainPageComponent } from './superadmin-main-page.component';

describe('SuperAdminMainPageComponent', () => {
  let component: SuperAdminMainPageComponent;
  let fixture: ComponentFixture<SuperAdminMainPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuperAdminMainPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuperAdminMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
