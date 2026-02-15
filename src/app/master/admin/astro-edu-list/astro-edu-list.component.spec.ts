import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AstroEduListComponent } from './astro-edu-list.component';

describe('AstroEduListComponent', () => {
  let component: AstroEduListComponent;
  let fixture: ComponentFixture<AstroEduListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AstroEduListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AstroEduListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
