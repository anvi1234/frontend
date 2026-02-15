import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AstroConsultationComponent } from './astro-consultation.component';

describe('AstroConsultationComponent', () => {
  let component: AstroConsultationComponent;
  let fixture: ComponentFixture<AstroConsultationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AstroConsultationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AstroConsultationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
