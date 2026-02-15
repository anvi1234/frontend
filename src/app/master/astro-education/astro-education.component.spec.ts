import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AstroEducationComponent } from './astro-education.component';

describe('AstroEducationComponent', () => {
  let component: AstroEducationComponent;
  let fixture: ComponentFixture<AstroEducationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AstroEducationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AstroEducationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
