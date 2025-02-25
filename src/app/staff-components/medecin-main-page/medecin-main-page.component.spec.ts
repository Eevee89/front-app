import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedecinMainPageComponent } from './medecin-main-page.component';

describe('MedecinMainPageComponent', () => {
  let component: MedecinMainPageComponent;
  let fixture: ComponentFixture<MedecinMainPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedecinMainPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedecinMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
